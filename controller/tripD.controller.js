const TripServices = require('../services/tripD.services');

// إنشاء رحلة جديدة
exports.createTrip = async (req, res) => {
    try {
        const { driverEmail, from, to, price, maxPassengers, date, time } = req.body;

        if (!driverEmail || !from || !to || !price || !maxPassengers || !date || !time) {
            return res.status(400).json({ status: false, error: "All fields are required." });
        }

        const trip = await TripServices.createTrip(driverEmail, from, to, price, maxPassengers, date, time);
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
