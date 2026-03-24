const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');

// @desc    Get all users
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res, next) => {
    try {
        const { role, page = 1, limit = 20 } = req.query;
        const query = {};
        if (role) query.role = role;

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            users,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        if (user.role === 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete admin users',
            });
        }

        // Remove associated doctor profile
        if (user.role === 'doctor') {
            await Doctor.findOneAndDelete({ userId: user._id });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get platform stats
// @route   GET /api/admin/stats
exports.getStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalDoctors = await Doctor.countDocuments();
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalAppointments = await Appointment.countDocuments();
        const pendingAppointments = await Appointment.countDocuments({ status: 'pending' });
        const completedAppointments = await Appointment.countDocuments({ status: 'completed' });
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);

        // Recent appointments
        const recentAppointments = await Appointment.find()
            .populate('patientId', 'name email')
            .populate({
                path: 'doctorId',
                populate: { path: 'userId', select: 'name' },
            })
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalDoctors,
                totalPatients,
                totalAppointments,
                pendingAppointments,
                completedAppointments,
                totalRevenue: totalRevenue[0]?.total || 0,
                recentAppointments,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all appointments (admin)
// @route   GET /api/admin/appointments
exports.getAllAppointments = async (req, res, next) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = {};
        if (status) query.status = status;

        const total = await Appointment.countDocuments(query);
        const appointments = await Appointment.find(query)
            .populate('patientId', 'name email phone')
            .populate({
                path: 'doctorId',
                populate: { path: 'userId', select: 'name email' },
            })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: appointments.length,
            total,
            totalPages: Math.ceil(total / Number(limit)),
            appointments,
        });
    } catch (error) {
        next(error);
    }
};
