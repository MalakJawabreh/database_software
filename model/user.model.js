const mongoose = require('mongoose');
const db = require('../config/db');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema({
    profilePicture: {
        type: String,
        required: false
    },
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
        minlength: 8,
        match: [
            /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
            'Password must contain at least one letter, one number, and be at least 8 characters long',
        ]
    },
    phoneNumber: {
        type: String,
        required: true,
        match: [/^(\+?[1-9]\d{1,14}|0\d{9})$/, 'Invalid phone number'],
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
    licensePicture: {
        type: String,
        required: false
    },
    InsurancePicture: {
        type: String,
        required: false
    },
    carNumber: {
        type: String,
        required: function () { return this.role === 'Driver'; },
    },
    carType: {
        type: String,
        required: function () { return this.role === 'Driver'; },
    },
    blockedUsers: [{
        type: Schema.Types.ObjectId, // يشير إلى معرف المستخدم
        ref: 'User', // المرجعية إلى مخطط المستخدم
    }],
   
});

// تشفير كلمة المرور
userSchema.pre('save', async function (next) {
    try {
        const user = this;

        if (!user.isModified('password')) {
            return next();
        }

        // التحقق من أن كلمة المرور تتوافق مع القواعد قبل التشفير
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (!passwordRegex.test(user.password)) {
            throw new Error('Password must contain at least one letter, one number, and be at least 8 characters long');
        }

        const salt = await bcrypt.genSalt(12);
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

const UserModel = db.model('User', userSchema);
module.exports = UserModel;
