const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const authMiddleware = require('../middleware/adminAuth'); // التحقق من صلاحيات الإدمن
const userController = require('../controller/user.controller');
const tripController = require('../controller/tripD.controller');

// تسجيل إدمن جديد
router.post('/register', adminController.register);

// تسجيل الدخول
router.post('/loginadmin', adminController.login);

// جلب جميع الإدمنين
router.get('/admins', authMiddleware, adminController.getAllAdmins);

// تعديل بيانات إدمن
router.put('/admins/:id', authMiddleware, adminController.updateAdmin);

// حذف إدمن
router.delete('/admins/:id', authMiddleware, adminController.deleteAdmin);
//add or edit or remove user - driver or passenger
router.post('/admin/add-user', authMiddleware, userController.addUser);
router.put('/admin/update-user/:userId', authMiddleware, userController.updateUser);
router.delete('/admin/delete-user/:userId', authMiddleware, userController.deleteUser);

//For Trips
router.post('/admin/addtrip', authMiddleware, tripController.createTrip);
router.put('/admin/updatetrip/:tripId', authMiddleware, tripController.updateTrip);
router.delete('/admin/deletetrip/:tripId', authMiddleware, tripController.deleteTrip);



module.exports = router;