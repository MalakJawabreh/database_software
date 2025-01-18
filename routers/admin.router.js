const express = require('express');
const router = express.Router();
const adminController = require('../controller/admin.controller');
const authMiddleware = require('../middleware/adminAuth'); // إذا كنت بحاجة للتحقق من التوثيق في المستقبل

// مسار التسجيل
router.post('/register', adminController.register);

// مسار تسجيل الدخول
router.post('/login', adminController.login);

// مسار جلب المستخدمين
router.get('/users', authMiddleware, adminController.getUsers);

module.exports = router;
