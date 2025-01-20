const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const authMiddleware = require('../middleware/adminAuth'); // التحقق من صلاحيات الإدمن

// تسجيل إدمن جديد
router.post('/register', authMiddleware, adminController.register);

// تسجيل الدخول
router.post('/login', adminController.login);

// جلب جميع الإدمنين
router.get('/admins', authMiddleware, adminController.getAllAdmins);

// تعديل بيانات إدمن
router.put('/admins/:id', authMiddleware, adminController.updateAdmin);

// حذف إدمن
router.delete('/admins/:id', authMiddleware, adminController.deleteAdmin);

module.exports = router;
