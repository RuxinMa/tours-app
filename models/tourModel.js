/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

// Define a simple Mongoose schema and model for demonstration
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // validation rule
      unique: true,
      trim: true, // remove blank spaces
      maxlength: [40, 'A tour name must have less or equal than 40 characters'], // validation rule
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'], // custom validation rule
    },
    slug: {
      type: String, // Slug for the tour name
      unique: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maxGroupSize'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty level'],
      enum: {
        values: ['easy', 'medium', 'difficult'], // options for difficulty
        message: 'Difficulty is either: easy, medium, or difficult', // error message if validation fails
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'], // validation rule
      max: [5, 'Rating must be below 5.0'], // validation rule
      set: (val) => Math.round(val * 10) / 10, // round to one decimal place
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return this.price > val;
        }, // Custom validation: priceDiscount must be less than or equal to price
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true, // remove blank spaces
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true, // remove blank spaces
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // do not show this field in the response by default
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false, // hidden tour
    },
    startLocation: {
      // GeoJSON obj
      type: {
        type: String,
        default: 'Point', // GeoJSON type
        enum: ['Point'], // must be Point
      },
      coordinates: [Number], // Array of number: [longitude, latitude]
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ], // Array of location objects
    guides: [
      {
        type: mongoose.Schema.ObjectId, // Child reference to User model
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true }, // include virtuals in the JSON output
    toObject: { virtuals: true }, // include virtuals in the object output
  },
);

// 🔎 Compound Index: improve query performance
tourSchema.index({ price: 1, ratingsAverage: -1 }); // Index for price in ascending order and ratingsAverage in descending order
// tourSchema.index({ slug: 1 }); // Index for slug in ascending order
tourSchema.index({ startLocation: '2dsphere' }); // 2dsphere index for geospatial queries

// Virtual Property
// virtual properties are not stored in the database, but can be used to calculate values based on other fields
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7; // this refers to the current document, can not use arrow function here
});

// ☀️ Virtual Populate: Get all reviews for this tour
tourSchema.virtual('reviews', {
  ref: 'Review', // name of the model to reference
  foreignField: 'tour', // field in the Review model that references this Tour
  localField: '_id', // field in the Tour model that is referenced by the Review
});

// 🪐 Ducument Middleware: runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true }); // Slugify: convert the name to a URL-friendly format
  next();
}); // pre post hook - 每次保存自动生成 slug

// 👨‍🌾 Embedding User Data (-> using ref in this project)
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises); // Wait for all promises to resolve
//   next();
// });

// tourSchema.pre('save', (next) => {
//   console.log('Will save document...'); // Log a message before saving the document
//   next();
// });

// tourSchema.post('save', (doc, next) => {
//   console.log(doc); // Log the document after saving the document
//   next();
// });

// ☀️ Query Middleware: runs before .find() and .findOne()
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } }); // Exclude secret tours from the query
  next();
});

// ☀️ Query Middleware: Populate guides field with actual user data
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

// ☃️ Aggregation Middleware: runs before .aggregate()
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } }); // Exclude secret tours from the aggregation pipeline
//   next();
// });

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
