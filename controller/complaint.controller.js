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

      static async getAllComplaints(req, res) {
        try {
          const complaints = await ComplaintService.getAllComplaints();
          return res.status(200).json({
            message: 'Complaints fetched successfully',
            data: complaints,
          });
        } catch (error) {
          return res.status(500).json({ error: 'Error fetching complaints: ' + error.message });
        }
      }
      static async updateComplaint(req, res) {
        try {
          const { id } = req.params;
          const updatedData = req.body;
    
          const updatedComplaint = await ComplaintService.updateComplaint(id, updatedData);
          return res.status(200).json({
            message: 'Complaint updated successfully',
            data: updatedComplaint,
          });
        } catch (error) {
          return res.status(500).json({ error: 'Error updating complaint: ' + error.message });
        }
      }
    
      static async deleteComplaint(req, res) {
        try {
          const { id } = req.params;
    
          const deletedComplaint = await ComplaintService.deleteComplaint(id);
          return res.status(200).json({
            message: 'Complaint deleted successfully',
            data: deletedComplaint,
          });
        } catch (error) {
          return res.status(500).json({ error: 'Error deleting complaint: ' + error.message });
        }
      }
      static async getComplaintCount(req, res) {
        try {
          const count = await ComplaintService.getComplaintCount();
          return res.status(200).json({
            message: 'Complaint count fetched successfully',
            count: count,
          });
        } catch (error) {
          return res.status(500).json({ error: 'Error fetching complaint count: ' + error.message });
        }
      }
      
    
      
}

module.exports = ComplaintController;
