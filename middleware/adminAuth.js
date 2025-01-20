const jwt = require('jsonwebtoken');

const adminAuth = (req, res, next) => {
    // الحصول على التوكن من الهيدر
    const token = req.headers.authorization?.split(' ')[1]; // يدعم "Bearer <token>"
    if (!token) {
        return res.status(403).json({ message: 'Access denied. No token provided.' });
    }

    try {
        // التحقق من صحة التوكن
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // التأكد أن الدور هو "admin"
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        // تعيين بيانات المسؤول في الطلب
        req.admin = decoded;
        next();
    } catch (error) {
        // معالجة الأخطاء (توكن غير صالح أو منتهي الصلاحية)
        res.status(401).json({ message: 'Invalid token.' });
    }
};

module.exports = adminAuth;
