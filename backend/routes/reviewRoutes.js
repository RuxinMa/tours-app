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

// ===== PUBLIC ROUTES =====
router.get('/', reviewController.getAllReviews);

// ===== 🔐 PROTECTED ROUTES =====
// Protect all routes after this middleware
router.use(authController.protect);

// GET /reviews/user/me
router.get('/user/me', reviewController.getMyReviews);

// POST /tours/:tourId/reviews
router.post(
  '/',
  authController.restrictTo('user'),
  reviewController.setTourUserIds, // Middleware to set tour and user IDs
  reviewController.createReview,
);

// ===== 🎯 ID-BASED ROUTES =====
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
