const Review = require('../model/reviews.model');

class ReviewService {
  static async createReview(data) { 
    const review = new Review(data);
    return await review.save();
  }

  static async getAverageRating(email) {
    // جلب جميع التقييمات الخاصة بالشخص
    const reviews = await Review.find({ reviewedEmail: email });

    if (reviews.length === 0) {
      return null; // إذا لم توجد تقييمات
    }

    // حساب المتوسط
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return averageRating.toFixed(2); // تقليل الرقم العشري إلى خانتين
  }

  static async getReviewByReviewerAndReviewed(reviewedEmail) {
    // جلب التقييم بناءً على البريدين
    const review = await Review.find({
      reviewedEmail,
    });

    return review;
  }
}


module.exports = ReviewService;
