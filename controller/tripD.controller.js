const TripServices = require('../services/tripD.services');

// إنشاء رحلة جديدة
exports.createTrip = async (req, res) => {
    try {
        const { name ,driverEmail,phoneNumber, from, to, price, maxPassengers,currentPassengers, date, time,carBrand} = req.body;

        if (!name|| !driverEmail ||!phoneNumber|| !from || !to || !price || !maxPassengers || !date || !time) {
            return res.status(400).json({ status: false, error: "All fields are required." });
        }

        const trip = await TripServices.createTrip(name,driverEmail,phoneNumber, from, to, price, maxPassengers,currentPassengers, date, time,carBrand);
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

//new

exports.getFilteredTrips = async (req, res) => {
    try {
        const { from, to, filterOption, filterValue, maxPrice } = req.query;
       //const { from, to, filterOption, filterValue, maxPrice } = req.body;
        // التحقق من إدخال from و to
        if (!from || !to) {
            return res.status(400).json({ status: false, error: "Both 'from' and 'to' fields are required." });
        }

        // إعداد الفلتر الأساسي
        const filter = { from, to };

        // تطبيق نوع الفلتر
        if (filterOption === 'Price' && maxPrice) {
            filter.price = { $lte: Number(maxPrice) }; // السعر أقل من أو يساوي
        } else if (filterOption === 'Car Type' && filterValue) {
            filter.carBrand = filterValue; // نوع السيارة
        } else if (filterOption === 'Time' && filterValue) {
            filter.time = filterValue; // وقت الرحلة
        } else if (filterOption === 'Date' && filterValue) {
            filter.date = filterValue; // تاريخ الرحلة
        } else if (filterOption === 'Driver Rating' && filterValue) {
            filter.driverRating = { $gte: Number(filterValue) }; // تقييم السائق أكبر من أو يساوي
        }

        // جلب النتائج بناءً على الفلتر
        const trips = await TripServices.getAllTrips(filter);

        res.status(200).json({ status: true, trips });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};
