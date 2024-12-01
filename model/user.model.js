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
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
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
        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(user.password, salt);
        user.password = hashPass;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (userPassword){
    try {
        const isMatch = await bcrypt.compare(userPassword,this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
}


const UserModel = db.model('User', userSchema);
module.exports = UserModel;