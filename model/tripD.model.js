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
    },
    time: {
        type: String,
        required: true,
    },
    status_trip: {
        type: String,
        enum: ['upcoming', 'completed', 'cancelled'],
        required: true,
    },
});

const TripModel = db.model('TripDriver', tripSchema);
module.exports = TripModel;
