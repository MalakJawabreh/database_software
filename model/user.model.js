const mongoose = require('mongoose');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: 8, // الحد الأدنى لطول كلمة المرور
        match: [
            /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            'Password must contain at least one letter, one number, and be at least 8 characters long',
        ]
    },
    
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        match: [/^(\+?[1-9]\d{1,14}|0\d{9})$/, 'Invalid phone number'], // الصيغة الدولية والمحلية
    },
    
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    role: {
        type: String,
        enum: ['Passenger', 'Driver', 'Service Provider'],
        required: true
    },
    carNumber: {
        type: String,
        required: function () { return this.role === 'Driver'; },
    },
    carType: {
        type: String,
        required: function () { return this.role === 'Driver'; },
    }
});

// تشفير كلمة المرور
userSchema.pre('save', async function (next) {
    try {
        const user = this;

        // إذا كانت كلمة المرور قد تم تعديلها فقط
        if (!user.isModified('password')) {
            return next();
        }

        const salt = await bcrypt.genSalt(12); // زيادة cost factor لتحسين الأمان
        const hashPass = await bcrypt.hash(user.password, salt);
        user.password = hashPass;
        next();
    } catch (error) {
        next(error);
    }
});

// مقارنة كلمة المرور
userSchema.methods.comparePassword = async function (userPassword) {
    try {
        return await bcrypt.compare(userPassword, this.password);
    } catch (error) {
        throw error;
    }
};

// التحقق من رقم الهاتف الفريد
userSchema.path('phoneNumber').validate(async function (value) {
    const count = await this.model('User').countDocuments({ phoneNumber: value });
    return count === 0;
}, 'Phone number already exists');

const UserModel = db.model('User', userSchema);
module.exports = UserModel;
