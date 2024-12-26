const ComplaintService = require('../services/complaint.services');

class ComplaintController {
    static async submitComplaint(req, res) {
        try {
          console.log(req.body); // عرض محتويات body للتأكد
          const complaintData = req.body;
      
          if (!complaintData.complainantName || !complaintData.complainantPhone || !complaintData.complainantEmail) {
            return res.status(400).json({ error: 'All fields are required' });
          }
      
          const savedComplaint = await ComplaintService.submitComplaint(complaintData);
          return res.status(201).json({
            message: 'Complaint submitted successfully',
            data: savedComplaint,
          });
        } catch (error) {
          return res.status(500).json({ error: 'Error submitting complaint: ' + error.message });
        }
      }
      
}

module.exports = ComplaintController;
