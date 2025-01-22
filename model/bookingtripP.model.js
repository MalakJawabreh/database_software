const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const booktripSchema = new Schema({
    nameP: {
        type: String,
        required: true,
        trim: true, // إزالة الفراغات الزائدة
    },
    EmailD: {
        type: String,
        required: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address'], // التحقق من صيغة البريد الإلكتروني
    },
    nameD: {
        type: String,
        required: true,
        trim: true,
    },
    EmailP: {
        type: String,
        required: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address'], // التحقق من صيغة البريد الإلكتروني
    },
    phoneNumberP: {
        type: String,
        required: true,
        match: [/^(\+?[1-9]\d{1,14}|0\d{9})$/, 'Invalid phone number'], // الصيغة الدولية والمحلية
    }
    ,
    phoneNumberD: {
        type: String,
        required: true,
        match: [/^(\+?[1-9]\d{1,14}|0\d{9})$/, 'Invalid phone number'], // الصيغة الدولية والمحلية
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive value'], // السعر يجب أن يكون موجبًا
    },
    date: {
        type: Date,
        required: true,

    },
    time: {
        type: String,
        required: true,
    },
    carBrand: {
        type: String,
        required: false, // إذا كان غير مطلوب
    },
    Note: {
        type: String,
        maxlength: [500, 'Note cannot exceed 500 characters'], // قيود على طول النص
    },
    seat: { 
        type: Number,
        required: true,
        min: [1, 'Seat number must be at least 1'], // عدد المقاعد يجب أن يكون 1 على الأقل
    },
    driverRate:{
        type: Number,
        required: false,
    },
    NoteRate:{
        type: String,
        required: false, // إذا كان غير مطلوب
    },
    pay: {
        type: Boolean,
        required: false,
        default: false, // القيمة الافتراضية
    },
    cancelled: {
        type: Boolean,
        required: false,
        default: false  // القيمة الافتراضية هي أن الحجز غير ملغى
    }
    
});

const bookTripModel = db.model('BookTrip', booktripSchema);
module.exports = bookTripModel;

//new