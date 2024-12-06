const bookTripService = require('../services/bookingtripP.services');

// إنشاء حجز جديد
const createBooking = async (req, res) => {
    try {
        const newBooking = await bookTripService.createBooking(req.body);
        res.status(201).json(newBooking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// الحصول على جميع الحجوزات
const getAllBookings = async (req, res) => {
    try {
        const bookings = await bookTripService.getAllBookings();
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = {
    createBooking,
    getAllBookings,
};
//new