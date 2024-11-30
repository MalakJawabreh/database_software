const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // الحصول على التوكن من الهيدر
    if (!token) {
        return res.status(401).json({ status: false, error: "No token provided." });
    }

    try {
        const decoded = jwt.verify(token, 'secretKey'); // فك تشفير التوكن
        req.user = decoded; // تعيين بيانات المستخدم إلى req.user
        next();
    } catch (error) {
        return res.status(401).json({ status: false, error: "Invalid token." });
    }
};

module.exports =authMiddleware;