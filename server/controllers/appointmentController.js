const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// @desc    Create appointment
// @route   POST /api/appointments
exports.createAppointment = async (req, res, next) => {
    try {
        const { doctorId, date, timeSlot, notes } = req.body;

        // Check doctor exists
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        // Check for conflicting appointment
        const existingAppointment = await Appointment.findOne({
            doctorId,
            date: new Date(date),
            timeSlot,
            status: { $in: ['pending', 'confirmed'] },
        });

        if (existingAppointment) {
            return res.status(400).json({
                success: false,
                message: 'This time slot is already booked',
            });
        }

        const appointment = await Appointment.create({
            patientId: req.user._id,
            doctorId,
            date: new Date(date),
            timeSlot,
            notes,
        });

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            appointment,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get appointments (role-based)
// @route   GET /api/appointments
exports.getAppointments = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        let query = {};

        // Filter by role
        if (req.user.role === 'patient') {
            query.patientId = req.user._id;
        } else if (req.user.role === 'doctor') {
            const doctor = await Doctor.findOne({ userId: req.user._id });
            if (doctor) {
                query.doctorId = doctor._id;
            }
        }
        // Admin sees all appointments

        if (status) {
            query.status = status;
        }

        const total = await Appointment.countDocuments(query);
        const appointments = await Appointment.find(query)
            .populate('patientId', 'name email phone avatar')
            .populate({
                path: 'doctorId',
                populate: {
                    path: 'userId',
                    select: 'name email phone avatar',
                },
            })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            appointments,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
exports.updateAppointment = async (req, res, next) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        // Doctors can confirm/reject, patients can cancel
        if (req.user.role === 'doctor') {
            const doctor = await Doctor.findOne({ userId: req.user._id });
            if (!doctor || doctor._id.toString() !== appointment.doctorId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized',
                });
            }
            if (!['confirmed', 'rejected', 'completed'].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Doctors can only confirm, reject, or complete appointments',
                });
            }
        } else if (req.user.role === 'patient') {
            if (appointment.patientId.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized',
                });
            }
            if (status !== 'cancelled') {
                return res.status(400).json({
                    success: false,
                    message: 'Patients can only cancel appointments',
                });
            }
        }

        appointment.status = status;
        await appointment.save();

        const updatedAppointment = await Appointment.findById(appointment._id)
            .populate('patientId', 'name email phone avatar')
            .populate({
                path: 'doctorId',
                populate: {
                    path: 'userId',
                    select: 'name email phone avatar',
                },
            });

        res.status(200).json({
            success: true,
            message: `Appointment ${status}`,
            appointment: updatedAppointment,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
exports.deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
            });
        }

        // Only the patient who created it or admin can delete
        if (
            req.user.role !== 'admin' &&
            appointment.patientId.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        await Appointment.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Appointment deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};
