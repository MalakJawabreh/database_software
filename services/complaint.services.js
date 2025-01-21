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
  static async updateComplaint(id, updatedData) {
    try {
      const updatedComplaint = await Complaint.findByIdAndUpdate(id, updatedData, { new: true });
      if (!updatedComplaint) {
        throw new Error('Complaint not found');
      }
      return updatedComplaint;
    } catch (error) {
      throw new Error('Error updating complaint: ' + error.message);
    }
  }

  static async deleteComplaint(id) {
    try {
      const deletedComplaint = await Complaint.findByIdAndDelete(id);
      if (!deletedComplaint) {
        throw new Error('Complaint not found');
      }
      return deletedComplaint;
    } catch (error) {
      throw new Error('Error deleting complaint: ' + error.message);
    }
  }
}




module.exports = ComplaintService;
