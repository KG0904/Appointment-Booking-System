const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all doctors (with search & filter)
// @route   GET /api/doctors
exports.getDoctors = async (req, res, next) => {
    try {
        const { specialization, search, minFee, maxFee, page = 1, limit = 10 } = req.query;

        const query = { isApproved: true };

        if (specialization) {
            query.specialization = { $regex: specialization, $options: 'i' };
        }

        if (minFee || maxFee) {
            query.consultationFee = {};
            if (minFee) query.consultationFee.$gte = Number(minFee);
            if (maxFee) query.consultationFee.$lte = Number(maxFee);
        }

        let doctorsQuery = Doctor.find(query).populate('userId', 'name email phone avatar');

        if (search) {
            const users = await User.find({
                name: { $regex: search, $options: 'i' },
                role: 'doctor',
            }).select('_id');
            const userIds = users.map((u) => u._id);
            query.$or = [
                { userId: { $in: userIds } },
                { specialization: { $regex: search, $options: 'i' } },
            ];
            doctorsQuery = Doctor.find(query).populate('userId', 'name email phone avatar');
        }

        const total = await Doctor.countDocuments(query);
        const doctors = await doctorsQuery
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: doctors.length,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            doctors,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
exports.getDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id).populate(
            'userId',
            'name email phone avatar'
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        res.status(200).json({
            success: true,
            doctor,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create doctor (admin)
// @route   POST /api/doctors
exports.createDoctor = async (req, res, next) => {
    try {
        const { name, email, password, specialization, experience, consultationFee, bio, phone } =
            req.body;

        // Create user with doctor role
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email',
            });
        }

        user = await User.create({
            name,
            email,
            password,
            role: 'doctor',
            phone,
        });

        const doctor = await Doctor.create({
            userId: user._id,
            specialization,
            experience,
            consultationFee,
            bio,
        });

        const populatedDoctor = await Doctor.findById(doctor._id).populate(
            'userId',
            'name email phone avatar'
        );

        res.status(201).json({
            success: true,
            message: 'Doctor created successfully',
            doctor: populatedDoctor,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update doctor
// @route   PUT /api/doctors/:id
exports.updateDoctor = async (req, res, next) => {
    try {
        const { specialization, experience, consultationFee, bio, availabilitySlots } = req.body;

        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        // Only allow the doctor themselves or admin to update
        if (
            req.user.role !== 'admin' &&
            doctor.userId.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this profile',
            });
        }

        if (specialization) doctor.specialization = specialization;
        if (experience !== undefined) doctor.experience = experience;
        if (consultationFee !== undefined) doctor.consultationFee = consultationFee;
        if (bio !== undefined) doctor.bio = bio;
        if (availabilitySlots) doctor.availabilitySlots = availabilitySlots;

        await doctor.save();

        const updatedDoctor = await Doctor.findById(doctor._id).populate(
            'userId',
            'name email phone avatar'
        );

        res.status(200).json({
            success: true,
            message: 'Doctor updated successfully',
            doctor: updatedDoctor,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete doctor (admin)
// @route   DELETE /api/doctors/:id
exports.deleteDoctor = async (req, res, next) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found',
            });
        }

        await Doctor.findByIdAndDelete(req.params.id);
        await User.findByIdAndUpdate(doctor.userId, { role: 'patient' });

        res.status(200).json({
            success: true,
            message: 'Doctor removed successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get doctor by userId
// @route   GET /api/doctors/me
exports.getMyDoctorProfile = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user._id }).populate(
            'userId',
            'name email phone avatar'
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor profile not found',
            });
        }

        res.status(200).json({
            success: true,
            doctor,
        });
    } catch (error) {
        next(error);
    }
};
