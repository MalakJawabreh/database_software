const mongoose = require('mongoose');
const db = require('../config/db');
const { Schema } = mongoose;

const booktripSchema = new Schema({
    nameP:{
        type: String,
        required: true,
    },
    EmailD: {
        type: String,
        required: true,
    },
    nameD:{
        type: String,
        required: true,
    },
    EmailP: {
        type: String,
        required: true,
    },
    phoneNumberP : {
        type: String,
        required: true,
    },
    phoneNumberD : {
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
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    Note: {
        type: String,
    },
    seat: {
        type: Number,
        required: true,
    },
});

const bookTripModel = db.model('BookTrip', booktripSchema);
module.exports = bookTripModel;