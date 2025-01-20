const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const authMiddleware = require('../middleware/adminAuth'); // التحقق من صلاحيات الإدمن
const userController = require('../controller/user.controller');

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

router.post('/admin/add-user', authMiddleware, userController.addUser);
router.put('/admin/update-user/:userId', authMiddleware, userController.updateUser);
router.delete('/admin/delete-user/:userId', authMiddleware, userController.deleteUser);

module.exports = router;
