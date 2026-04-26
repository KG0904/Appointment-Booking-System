// ✅ Safe Stripe initialization
let stripe = null;

if (
  process.env.STRIPE_SECRET_KEY &&
  process.env.STRIPE_SECRET_KEY.startsWith("sk_")
) {
  const Stripe = require("stripe");
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');


// @desc    Create payment intent / checkout session
// @route   POST /api/payments/create
exports.createPayment = async (req, res, next) => {
    try {
        const { appointmentId } = req.body;

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        // Verify ownership
        if (appointment.patientId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        const doctor = await Doctor.findById(appointment.doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        const amount = doctor.consultationFee;

        // 🔥 If Stripe NOT configured → simulate payment
        if (!stripe) {
            const payment = await Payment.create({
                appointmentId,
                amount,
                stripePaymentIntentId: 'sim_' + Date.now(),
                status: 'completed',
                paidBy: req.user._id,
            });

            appointment.paymentStatus = 'completed';
            await appointment.save();

            return res.status(200).json({
                success: true,
                message: 'Payment simulated (Stripe not configured)',
                clientSecret: null,
                payment,
                simulated: true,
            });
        }

        // ✅ Real Stripe payment
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'inr',
            metadata: {
                appointmentId: appointmentId,
                patientId: req.user._id.toString(),
            },
        });

        const payment = await Payment.create({
            appointmentId,
            amount,
            stripePaymentIntentId: paymentIntent.id,
            status: 'pending',
            paidBy: req.user._id,
        });

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            payment,
        });

    } catch (error) {
        next(error);
    }
};


// @desc    Verify payment
// @route   POST /api/payments/verify
exports.verifyPayment = async (req, res, next) => {
    try {
        const { paymentIntentId, appointmentId } = req.body;

        const payment = await Payment.findOne({
            $or: [
                { stripePaymentIntentId: paymentIntentId },
                { appointmentId: appointmentId },
            ],
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        // 🔥 Only verify with Stripe if real payment + stripe exists
        if (stripe && paymentIntentId && !paymentIntentId.startsWith('sim_')) {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status === 'succeeded') {
                payment.status = 'completed';
                await payment.save();

                await Appointment.findByIdAndUpdate(payment.appointmentId, {
                    paymentStatus: 'completed',
                });
            }
        }

        res.status(200).json({
            success: true,
            payment,
        });

    } catch (error) {
        next(error);
    }
};


// @desc    Get payment by appointment
// @route   GET /api/payments/:appointmentId
exports.getPaymentByAppointment = async (req, res, next) => {
    try {
        const payment = await Payment.findOne({
            appointmentId: req.params.appointmentId,
        }).populate('paidBy', 'name email');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        res.status(200).json({
            success: true,
            payment,
        });

    } catch (error) {
        next(error);
    }
};