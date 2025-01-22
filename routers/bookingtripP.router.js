const express = require('express');
const router = express.Router();
const bookTripController = require('../controller/booktripP.controller');

// إنشاء حجز جديد
router.post('/book_trip', bookTripController.createBooking);

// الحصول على جميع الحجوزات
router.get('/get_booking_trip', bookTripController.getAllBookings);
router.get('/Bookung_emailP', bookTripController.getBookingsByEmail);


router.get('/passengers', bookTripController.getPassengersByTrip);

router.delete('/delete_book/:id', bookTripController.cancelBooking);
router.put('/update_booking/:id', bookTripController.updateBooking);
router.put('/update_Booking_Rate/:id', bookTripController.updateBookingRate);
router.get('/BookingsCountByDate', bookTripController.getNewBookingsCountByDate);





//new
module.exports = router;
