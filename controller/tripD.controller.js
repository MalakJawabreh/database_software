const TripServices = require('../services/tripD.services');

// إنشاء رحلة جديدة
exports.createTrip = async (req, res) => {
    try {
        const { name ,driverEmail,phoneNumber, from, to, price, maxPassengers,currentPassengers, date, time,carBrand,visibilty_trip} = req.body;

        if (!name|| !driverEmail ||!phoneNumber|| !from || !to || !price || !maxPassengers || !date || !time) {
            return res.status(400).json({ status: false, error: "All fields are required." });
        }

        const trip = await TripServices.createTrip(name,driverEmail,phoneNumber, from, to, price, maxPassengers,currentPassengers, date, time,carBrand,visibilty_trip);
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



exports.deleteTrip = async (req, res) => {
    try {
        const { tripId } = req.params; // الحصول على tripId من req.params
        if (!tripId) {
            return res.status(400).json({ status: false, error: "Trip ID is required." });
        }

        // استدعاء الخدمة لحذف الرحلة
        const result = await TripServices.deleteTrip(tripId);

        res.status(200).json({ status: true, message: result.message, deletedTrip: result.trip });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: error.message });
    }
};

exports.updateTrip = async (req, res) => {
    try {
        const { tripId } = req.params; // تعديل الاسم ليطابق الرابط
        console.log("Request Params:", req.params); // إضافة تسجيل لمعرفة ما يتم استلامه

        const updates = req.body;

        if (!tripId) {
            return res.status(400).json({ status: false, error: "Trip ID is required." });
        }

        const updatedTrip = await TripServices.updateTrip(tripId, updates);
        res.status(200).json({ status: true, updatedTrip });
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
      const { from, to, maxPrice, carBrand, time, date, driverRating, name } = req.query;
  
      // التحقق من إدخال from و to
      if (!from || !to) {
        return res.status(400).json({ status: false, error: "Both 'from' and 'to' fields are required." });
      }
  
      // إعداد الفلتر الأساسي
      const filter = { from, to };
  
      // تطبيق الفلاتر المحددة
      if (maxPrice) filter.price = { $lte: Number(maxPrice) }; // السعر أقل من أو يساوي
      if (carBrand) filter.carBrand = carBrand; // نوع السيارة
      if (time) filter.time = time; // وقت الرحلة
      if (date) filter.date = date; // تاريخ الرحلة
      if (driverRating) filter.driverRating = { $gte: Number(driverRating) }; // تقييم السائق أكبر من أو يساوي
      if (name) filter.name = name; // اسم السائق
  
      console.log("Filter applied:", filter);
  
      // جلب النتائج بناءً على الفلتر
      const trips = await TripServices.getAllTrips(filter);
  
      res.status(200).json({ status: true, trips });
    } catch (error) {
      console.error(error);
      res.status(400).json({ status: false, error: error.message });
    }
  };
   

// جلب الرحلات بناءً على جندر المستخدم
exports.getTripsByGender = async (req, res) => {
    try {
        const userId = req.params.userId; // جلب الـ userId من الـ URL
        if (!userId) {
            return res.status(400).json({ status: false, error: "User ID is required." });
        }

        // جلب الرحلات بناءً على الجندر
        const trips = await TripServices.getTripsByGender(userId);
        res.status(200).json({ status: true, trips });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};
// جلب إحصائيات الرحلات
exports.getTripStatistics = async (req, res) => {
    try {
        const stats = await TripServices.getTripStatistics();
        console.log('Trip Statistics:', stats);
        res.status(200).json({ status: true, stats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: error.message });
    }
};
// جلب عدد الرحلات المكتملة فقط
exports.getCompletedTripsCount = async (req, res) => {
    try {
        const completedTripsCount = await TripServices.getCompletedTripsCount();
        res.status(200).json({ status: true, completedTripsCount });
    } catch (error) {
        console.error(error);
        res.status(400).json({ status: false, error: error.message });
    }
};




