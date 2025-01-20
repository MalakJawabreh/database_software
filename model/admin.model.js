const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'admin',
        enum: ['admin'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// تشفير كلمة المرور قبل الحفظ
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// التحقق من كلمة المرور
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const Admin = db.model('Admin', adminSchema);

module.exports = Admin;
