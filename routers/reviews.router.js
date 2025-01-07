const router = require('express').Router();
const ReviewController = require('../controller/reviews.controller');

router.post('/review_post', ReviewController.createReview);
router.get('/average_rate/:email', ReviewController.getAverageRating); // المسار الجديد
router.get('/get_rev_from_to/:reviewerEmail/:reviewedEmail', ReviewController.getReviewByReviewerAndReviewed); // المسار الجديد


module.exports = router;
