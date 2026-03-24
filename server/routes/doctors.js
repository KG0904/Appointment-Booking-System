const express = require('express');
const {
    getDoctors,
    getDoctor,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    getMyDoctorProfile,
} = require('../controllers/doctorController');
const protect = require('../middleware/auth');
const authorize = require('../middleware/role');

const router = express.Router();

router.get('/', getDoctors);
router.get('/me', protect, authorize('doctor'), getMyDoctorProfile);
router.get('/:id', getDoctor);
router.post('/', protect, authorize('admin'), createDoctor);
router.put('/:id', protect, authorize('doctor', 'admin'), updateDoctor);
router.delete('/:id', protect, authorize('admin'), deleteDoctor);

module.exports = router;
