const express = require('express');
const ComplaintController = require('../controller/complaint.controller');
const router = express.Router();

// نقطة الـ API لإرسال الشكوى
router.post('/submitComplaint', ComplaintController.submitComplaint);

router.get('/getAllComplaints', ComplaintController.getAllComplaints);
module.exports = router;
