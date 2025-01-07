const ReviewService = require('../services/reviews.services');

class ReviewController {
  static async createReview(req, res) {
    try {
      const review = await ReviewService.createReview(req.body);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async getAverageRating(req, res) {
    try {
      const { email } = req.params; // الحصول على الإيميل من الـ URL
      const averageRating = await ReviewService.getAverageRating(email);

      if (averageRating === null) {
        return res.status(404).json({ message: 'No reviews found for this user' });
      }

      res.status(200).json({ email, averageRating });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getReviewByReviewerAndReviewed(req, res) {
    const { reviewerEmail, reviewedEmail } = req.params;

    // إزالة المسافات وأي أحرف غير مرئية
    const cleanReviewerEmail = reviewerEmail.trim();
    const cleanReviewedEmail = reviewedEmail.trim();

    console.log('Cleaned Params:', { cleanReviewerEmail, cleanReviewedEmail });

    try {
        const review = await ReviewService.getReviewByReviewerAndReviewed(cleanReviewerEmail, cleanReviewedEmail);
        if (!review) {
            console.log(`No review found for ${cleanReviewerEmail} -> ${cleanReviewedEmail}`);
            return res.status(404).json({
                message: `No review found from ${cleanReviewerEmail} to ${cleanReviewedEmail}`,
            });
        }

        res.status(200).json(review);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
}

}

module.exports = ReviewController;
