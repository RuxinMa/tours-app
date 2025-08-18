const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);

exports.setTourUSerIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId; // Set tour ID from URL if not provided
  if (!req.body.user) req.body.user = req.user._id; // Set user ID from authenticated user
  next(); // Call the next middleware or route handler
};

exports.getMyReviews = catchAsync(async (req, res, next) => {
  // Get all reviews for the authenticated user
  const reviews = await Review.find({ user: req.user._id })
    .populate({
      path: 'tour',
      select: 'name slug imageCover', // Populate tour details for each review
    })
    .populate({
      path: 'user',
      select: 'name photo',
    })
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  });
});

exports.checkReviewOwnership = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  // Check if the review belongs to the authenticated user or if the user is an admin
  if (
    review.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    return next(
      new AppError('You do not have permission to perform this action', 403),
    );
  }

  next();
});

exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review); // run setTourUSerIds middleware before this to set tour and user IDs
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
