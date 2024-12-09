const BookTrip = require('../model/bookingtripP.model');
const TripModel = require('../model/tripD.model');

// إضافة حجز جديد
const createBooking = async (data) => {
    // التحقق إذا كان الراكب قد حجز بالفعل على نفس الرحلة
    const existingBooking = await BookTrip.findOne({
        nameP: data.nameP,
        from: data.from,
        to: data.to,
        date: data.date,
        time: data.time
    });

    if (existingBooking) {
        throw new Error("You have already booked this trip.");
    }

    // التحقق إذا كان الراكب لديه حجز آخر في نفس الوقت
    const conflictingBooking = await BookTrip.findOne({
        nameP: data.nameP,
        date: data.date,
        time: data.time
    });

    if (conflictingBooking) {
        throw new Error("You cannot book two trips at the same time.");
    }

    // العثور على الرحلة المطلوبة بناءً على من، إلى، التاريخ، والوقت
    const tripDetails = await TripModel.findOne({
        from: data.from,
        to: data.to,
        date: data.date,
        time: data.time
    });

    if (!tripDetails) {
        throw new Error("Trip not found.");
    }

    // التحقق من المقاعد المتاحة مقارنة بـ maxPassengers
    const bookingsOnSameTrip = await BookTrip.find({
        from: data.from,
        to: data.to,
        date: data.date,
        time: data.time
    });

    const totalSeatsBooked = bookingsOnSameTrip.reduce((total, booking) => total + booking.seat, 0);

    if (totalSeatsBooked + data.seat > tripDetails.maxPassengers) {
        throw new Error(`No available seats for this trip. Maximum capacity is ${tripDetails.maxPassengers} passengers.`);
    }

    // إنشاء الحجز الجديد
    const newBooking = new BookTrip(data);
    return await newBooking.save();
};

// الحصول على جميع الحجوزات
const getAllBookings = async () => {
    return await BookTrip.find();
};

const getBookingsByEmail2 = async (EmailP) => {
    try{
    return await BookTrip.find({ EmailP: EmailP }); }
    catch (error) {
        throw error;
    }
};

module.exports = {
    createBooking,
    getAllBookings,
    getBookingsByEmail2,
};
