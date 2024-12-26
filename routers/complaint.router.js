const express = require('express');
const ComplaintController = require('../controller/complaint.controller');
const router = express.Router();

// نقطة الـ API لإرسال الشكوى
router.post('/submitComplaint', ComplaintController.submitComplaint);

module.exports = router;
