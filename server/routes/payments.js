const express = require('express');
const {
    createPayment,
    verifyPayment,
    getPaymentByAppointment,
} = require('../controllers/paymentController');
const protect = require('../middleware/auth');

const router = express.Router();

router.post('/create', protect, createPayment);
router.post('/verify', protect, verifyPayment);
router.get('/:appointmentId', protect, getPaymentByAppointment);

module.exports = router;
