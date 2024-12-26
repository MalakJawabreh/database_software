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

  // يمكنك إضافة وظائف أخرى مثل استرجاع الشكاوى هنا إذا لزم الأمر
}

module.exports = ComplaintService;
