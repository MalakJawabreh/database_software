const express = require('express');
const router = express.Router();
const bookTripController = require('../controller/booktripP.controller');

// إنشاء حجز جديد
router.post('/book_trip', bookTripController.createBooking);

// الحصول على جميع الحجوزات
router.get('/get_booking_trip', bookTripController.getAllBookings);


module.exports = router;