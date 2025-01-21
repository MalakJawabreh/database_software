const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        //trim: true,
        lowercase: true,
       
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


////
adminSchema.pre('save', async function (next) {
    try {
        const admin = this;

        if (!admin.isModified('password')) {
            return next();
        }

        

        const salt = await bcrypt.genSalt(12);
        const hashPass = await bcrypt.hash(admin.password, salt);
        admin.password = hashPass;
        next();
    } catch (error) {
        next(error);
    }
});
// التحقق من كلمة المرور
adminSchema.methods.comparePassword = async function (adminPassword) {
    try {
        return await bcrypt.compare(adminPassword, this.password);
    } catch (error) {
        throw error;
    }
};
const Admin = db.model('Admin', adminSchema);

module.exports = Admin;
