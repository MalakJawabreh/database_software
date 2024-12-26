const mongoose = require('mongoose');
const db = require('../config/db');

const complaintSchema = new mongoose.Schema({
  complainantName: { type: String, required: true },
  complainantEmail: { type: String, required: true },
  complainantPhone: { type: String, required: true },
  reportedPersonName: { type: String, required: true },
  reportedPersonRole: { type: String, required: true },
  reportedPersonPhone: { type: String, required: true },
  complaintDetails: { type: String, required: true },
  complaintType: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

//const Complaint = mongoose.model('Complaint', complaintSchema);
const Complaint = db.model('Complaint', complaintSchema);

module.exports = Complaint;
