const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// Define the router
const router = express.Router({ mergeParams: true }); // Merge params from parent route (tour)

// ✅ Allow two independent routing mounts

// POST /tours/:tourId/reviews
// GET /tours/:tourId/reviews

// GET /reviews
// DELETE /reviews/:id

// 🔐 Protect all routes after this middleware
router.use(authController.protect);

// 🎯 Get all reviews for the authenticated user
router.get('/my-reviews', reviewController.getMyReviews);

router.route('/').get(reviewController.getAllReviews).post(
  authController.restrictTo('user'),
  reviewController.setTourUSerIds, // Middleware to set tour and user IDs
  reviewController.createReview,
); // Create a new review for a tour

router
  .route('/:id')
  .get(reviewController.getReview) // Get a review by ID
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.checkReviewOwnership, // Middleware to check ownership
    reviewController.updateReview, // Update a review by ID
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.checkReviewOwnership, // Middleware to check ownership
    reviewController.deleteReview,
  ); // Delete a review by ID

module.exports = router;
