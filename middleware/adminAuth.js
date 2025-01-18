const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(403).json({ message: 'Access denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (verified.role !== 'admin') throw new Error('Not authorized');
        req.admin = verified;
        next();
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};
