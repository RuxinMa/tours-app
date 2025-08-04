const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getAllReviews = factory.getAll(Review);

exports.setTourUSerIds = (req, res, next) => {
  // Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId; // Set tour ID from URL if not provided
  if (!req.body.user) req.body.user = req.user._id; // Set user ID from authenticated user
  next(); // Call the next middleware or route handler
};

exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review); // run setTourUSerIds middleware before this to set tour and user IDs
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
