const TripServices = require('../services/tripD.services');

// إنشاء رحلة جديدة
exports.createTrip = async (req, res) => {
    try {
        const { name ,driverEmail,phoneNumber, from, to, price, maxPassengers, date, time } = req.body;

        if (!name|| !driverEmail ||!phoneNumber|| !from || !to || !price || !maxPassengers || !date || !time) {
            return res.status(400).json({ status: false, error: "All fields are required." });
        }

        const trip = await TripServices.createTrip(name,driverEmail,phoneNumber, from, to, price, maxPassengers, date, time);
        res.status(200).json({ status: true, trip });
    } catch (error) { 
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};

// جلب الرحلات الخاصة بالسائق
exports.getDriverTrips = async (req, res) => {
    try {
        const { driverEmail } = req.query;
        if (!driverEmail) {
            return res.status(400).json({ status: false, error: "Driver email is required." });
        }

        const trips = await TripServices.getDriverTrips(driverEmail);
        res.status(200).json({ status: true, trips });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};

// حذف رحلة بناءً على الـ id
exports.deleteTrip = async (req, res) => {
    try {
        const { id } = req.params; // الـ id سيتم تمريره في URL
        if (!id) {
            return res.status(400).json({ status: false, error: "Trip ID is required." });
        }

        const deletedTrip = await TripServices.deleteTrip(id);
        res.status(200).json({ status: true, message: "Trip deleted successfully.", deletedTrip });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};


// جلب جميع الرحلات لجميع السائقين
exports.getAllTrips = async (req, res) => {
    try {
        const trips = await TripServices.getAllTrips();
        res.status(200).json({ status: true, trips });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};


