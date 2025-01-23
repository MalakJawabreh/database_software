const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const authMiddleware = require('../middleware/adminAuth'); // التحقق من صلاحيات الإدمن
const userController = require('../controller/user.controller');
const tripController = require('../controller/tripD.controller');
const BookController = require('../controller/booktripP.controller');
const complainant = require ('../controller/complaint.controller')


console.log('Admin router loaded'); 

//   register new admin
router.post('/register', adminController.register);

// login admin
router.post('/loginadmin', adminController.login);

// get all admin
router.get('/admins', authMiddleware, adminController.getAllAdmins);

//  update info for admin
router.put('/admins/:id', authMiddleware, adminController.updateAdmin);

// delete Admin
router.delete('/adminsdelete/:id', authMiddleware, adminController.deleteAdmin);
//add or edit or remove user - driver or passenger
router.post('/admin/add-user', authMiddleware, userController.addUser);
router.put('/admin/update-user/:userId', authMiddleware, userController.updateUser);
router.delete('/admin/delete-user/:userId', authMiddleware, userController.deleteUser);
//For Trips
router.post('/admin/addtrip', authMiddleware, tripController.createTrip);
router.put('/admin/updatetrip/:tripId', authMiddleware, tripController.updateTrip);
router.delete('/admin/deletetrip/:tripId', authMiddleware, tripController.deleteTrip);
//For book
router.post('/admin/bookadd', authMiddleware, BookController.createBooking);
router.put('/admin/editbook/:bookId', authMiddleware, BookController.updateBooking);
router.delete('/admin/bookdelet/:bookId', authMiddleware, BookController.cancelBooking);

//for Complaint
router.put('/admin/update-Comp/:compId', authMiddleware, complainant.updateComplaint);
router.delete('/admin/delete-comp/:compId', authMiddleware, complainant.deleteComplaint);

//  show  statistics for trips
router.get('/admin/statistics',authMiddleware, tripController.getTripStatistics);
//for completed Trips Only 
router.get('/admin/completedcount',authMiddleware, tripController.getCompletedTripsCount);

//show total and active users
router.get('/admin/total-users',authMiddleware, userController.getTotalUsers);
router.get('/admin/active-users',authMiddleware, userController.getActiveUsers);
//show number of complainant
router.get('/admin/complaintscount',authMiddleware, complainant.getComplaintCount);
//show number of booking new
router.get('/admin/newbook',authMiddleware, BookController.getNewBookingsCountByDate);
// show Cancelled Bookings Count
router.get('/admin/CancelledBookingsCount',authMiddleware, BookController.getCancelledBookingsCount);
//show Cancelled Bookings info 

router.get('/admin/Cancelled-Bookings',authMiddleware, BookController.getCancelledBookings);

module.exports = router;