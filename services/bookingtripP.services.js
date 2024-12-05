const BookTrip = require('../model/bookingtripP.model');

// إضافة حجز جديد
const createBooking = async (data) => {
    const newBooking = new BookTrip(data);
    return await newBooking.save();
};

// الحصول على جميع الحجوزات
const getAllBookings = async () => {
    return await BookTrip.find();
};


module.exports = {
    createBooking,
    getAllBookings,
};
