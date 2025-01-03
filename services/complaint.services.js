const Complaint = require('../model/complaint.model');

class ComplaintService {
  static async submitComplaint(complaintData) {
    try {
      const newComplaint = new Complaint(complaintData);
      await newComplaint.save();
      return newComplaint;
    } catch (error) {
      throw new Error('Error saving complaint: ' + error.message);
    }
  }
  static async getAllComplaints() {
    try {
      const complaints = await Complaint.find();
      return complaints;
    } catch (error) {
      throw new Error('Error fetching complaints: ' + error.message);
    }
  }

}

module.exports = ComplaintService;
