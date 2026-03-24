const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        specialization: {
            type: String,
            required: [true, 'Specialization is required'],
            trim: true,
        },
        experience: {
            type: Number,
            required: [true, 'Experience is required'],
            min: 0,
        },
        consultationFee: {
            type: Number,
            required: [true, 'Consultation fee is required'],
            min: 0,
        },
        bio: {
            type: String,
            trim: true,
            maxlength: 1000,
            default: '',
        },
        availabilitySlots: [
            {
                day: {
                    type: String,
                    enum: [
                        'Monday',
                        'Tuesday',
                        'Wednesday',
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                    ],
                    required: true,
                },
                startTime: {
                    type: String,
                    required: true,
                },
                endTime: {
                    type: String,
                    required: true,
                },
            },
        ],
        isApproved: {
            type: Boolean,
            default: true,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        totalPatients: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// Virtual populate for user info
doctorSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true,
});

doctorSchema.set('toJSON', { virtuals: true });
doctorSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Doctor', doctorSchema);
