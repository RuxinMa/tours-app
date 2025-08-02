// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
      trim: true, // remove blank spaces
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above 1.0'], // validation rule
      max: [5, 'Rating must be below 5.0'], // validation rule
    },
    createdAt: {
      type: Date,
      default: Date.now(), // default value
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour', // Reference to the Tour model
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User', // Reference to the User model
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true }, // include virtuals in the JSON output
    toObject: { virtuals: true }, // include virtuals in the object output
  },
);

// 🔎 Compound index: ensure unique reviews per user per tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// ☀️ Query Middleware: Populate tour and user details
// reviewSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'tour',
//     select: 'name',
//   }).populate({
//     path: 'user',
//     select: 'name photo',
//   });
//   next();
// });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// 📊 Static method to calculate average ratings for a tour
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  // console.log('tourId', tourId);
  // this refers to the model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }, // Match reviews for the specific tour
    },
    {
      $group: {
        _id: '$tour', // Group by tour ID
        nRating: { $sum: 1 }, // Count the number of reviews
        avgRating: { $avg: '$rating' }, // Calculate the average rating
      },
    },
  ]);
  // console.log('stats:', stats);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating, // Update the number of ratings
      ratingsAverage: stats[0].avgRating, // Update the average rating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0, // Reset the number of ratings to 0
      ratingsAverage: 4.5, // Reset the average rating to default value
    });
  }
};

// 📂 Post-save hook: 新增评论后重新计算平均分
reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.tour);
});

// 🌀 Pre-update/delete hook: 保存即将被修改/删除的文档信息
reviewSchema.pre(/^findOneAnd/, async function (next) {
  const Review = this.model;
  const query = this.getQuery();
  this.r = await Review.findOne(query);
  next();
});

// 🔖 Post-update/delete hook: 使用保存的文档信息重新计算平均分
reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r && this.r.tour) {
    // console.log(
    //   '🔄 Recalculating ratings after update/delete for tour:',
    //   this.r.tour,
    // );
    await this.r.constructor.calcAverageRatings(this.r.tour);
  } else {
    // console.warn('⚠️ No review document found for recalculation');
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
