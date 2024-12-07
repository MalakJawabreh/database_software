const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const tripSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    driverEmail: {
        type: String,
        required: true,
    },
    phoneNumber : {
        type: String,
        required: true,
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
    },
    maxPassengers: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value >= new Date(),
            message: 'Date must be in the future.',
        },
    },
    time: {
        type: String,
        required: true,
    },
    carBrand: {
        type: String,
        required: false, // إذا كان غير مطلوب
    },
    driverRating: {
        type: Number,
        required: false, // اجعله غير مطلوب في البداية إذا لم يكن موجودًا
        min: 0,
        max: 5,
    },
    
    status_trip: {
        type: String,
        enum: ['upcoming', 'completed', 'cancelled'],
        required: true,
        default: 'upcoming',
    },
    
});

const TripModel = db.model('TripDriver', tripSchema);
module.exports = TripModel;

//new