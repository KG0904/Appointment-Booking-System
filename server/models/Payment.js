const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        stripePaymentIntentId: {
            type: String,
            default: '',
        },
        stripeSessionId: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending',
        },
        paidBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
