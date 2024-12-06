const router = require('express').Router();
const TripController = require('../controller/tripD.controller');

// إنشاء رحلة
router.post('/create_trip', TripController.createTrip);

// جلب الرحلات الخاصة بالسائق
router.get('/driver_trips', TripController.getDriverTrips);

// حذف رحلة
router.delete('/delete_trip/:id', TripController.deleteTrip);


router.get('/all_trip', TripController.getAllTrips);

module.exports = router;
//new
