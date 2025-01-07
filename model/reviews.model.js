const mongoose = require('mongoose');
const db = require('../config/db');

const reviewSchema = new mongoose.Schema({
  reviewerName: { type: String, required: true },
  reviewerEmail: { type: String, required: true },
  reviewedName: { type: String, required: true },
  reviewedEmail: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  notes: { type: String, default: '' },
}, { timestamps: true });

const reviews = db.model('Review', reviewSchema);

module.exports = reviews;
