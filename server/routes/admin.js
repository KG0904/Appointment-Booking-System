const express = require('express');
const {
    getAllUsers,
    deleteUser,
    getStats,
    getAllAppointments,
} = require('../controllers/adminController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/role');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);
router.get('/appointments', getAllAppointments);

module.exports = router;
