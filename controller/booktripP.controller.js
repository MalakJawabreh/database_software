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

const getBookingsByEmail = async (req, res) => {
    try {
        const { EmailP } = req.query;
        if (!EmailP) {
            return res.status(400).json({ status: false, error: "Passenger email is required." });
        }

        const trips = await bookTripService.getBookingsByEmail2(EmailP);
        res.status(200).json({ status: true, trips });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};
// جلب أسماء ومعلومات الركاب حسب معلومات الرحلة
const getPassengersByTrip = async (req, res) => {
    try {
        const { driverEmail, from, to, date, time } = req.query;

        // التحقق من وجود جميع الحقول المطلوبة
        if (!driverEmail || !from || !to || !date || !time) {
            return res.status(400).json({ status: false, error: "All fields (driverEmail, from, to, date, time) are required." });
        }

        const passengers = await bookTripService.getPassengersByTrip(driverEmail, from, to, date, time);
        res.status(200).json({ status: true, passengers });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: error.message });
    }
};

// const cancelBooking = async (req, res) => {
//     try {
//         const { bookingId } = req.params;
//         if (!bookingId) {
//             return res.status(400).json({ message: "Booking ID is required." });
//         }

//         const result = await bookTripService.cancelBooking(bookingId);
//         res.status(200).json(result);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };
 


module.exports = {
    createBooking,
    getAllBookings,
    getBookingsByEmail,
    getPassengersByTrip
    //cancelBooking,
};
//new