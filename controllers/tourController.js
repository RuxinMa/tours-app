/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const multer = require('multer'); // Import multer for file uploads
const sharp = require('sharp'); // Import sharp for image processing
const Tour = require('../models/tourModel'); // Import the Tour model
const catchAsync = require('../utils/catchAsync'); // Import the catchAsync utility
const factory = require('./handlerFactory'); // Import the factory functions
const AppError = require('../utils/appError'); // Import the AppError utility

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`), // relative path to testing JSON file
// );

// Use memory storage for processing images in memory (🔑 as buffer)
const multerStorage = multer.memoryStorage();

// Filter function to check if the uploaded file is an image
const multerFilter = (req, file, cb) => {
  // Check if the uploaded file is an image
  if (file.mimetype.startsWith('image')) {
    cb(null, true); // Accept the file
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false); // Reject the file
  }
};

const upload = multer({
  storage: multerStorage, // Set the storage engine
  fileFilter: multerFilter, // Set the file filter
});

// Middleware to handle multiple file uploads
exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 }, // Upload a single cover image
  { name: 'images', maxCount: 3 }, // Upload multiple images (up to 3)
]);

upload.single('imageCover'); // Middleware to handle single file upload for cover image
// upload.array('images'); // Middleware to handle multiple file uploads for images

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // 0) Check if files are uploaded
  if (!req.files.images || !req.files.imageCover) return next();

  // 1) Process cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Process images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const fileName = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${fileName}`);

      req.body.images.push(fileName); // Add the processed image to the images array
    }),
  );

  // 3) Call the next middleware or route handler
  next();
});

// Handlers for the tour routes
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5'; // Limit to 5 tours
  req.query.sort = '-ratingsAverage,price'; // Sort by ratings average and price
  req.query.fields = 'name,price,ratingsAverage,difficulty,duration'; // Select specific fields
  next(); // Call the next middleware or route handler
};

/* GET ALL TOURS */
exports.getAllTours = factory.getAll(Tour); // Refactored to use factory function

/* GET A TOUR BY ID */
exports.getTourbyId = factory.getOne(Tour, { path: 'reviews' }); // Get one tour by ID and populate the reviews field

/* CREATE NEW TOUR */
exports.createTour = factory.createOne(Tour);

/* UPATE A TOUR */
exports.updateTour = factory.updateOne(Tour);

/* DELETE A TOUR */
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }, // Match tours with average rating >= 4.5
    },
    {
      $group: {
        // _id: '$difficulty', // Group by difficulty level
        _id: { $toUpper: '$difficulty' }, // Group by difficulty level (converted to uppercase)
        num: { $sum: 1 }, // Count the number of tours
        numRatings: { $sum: '$ratingsQuantity' }, // Sum the ratings quantity
        avgRating: { $avg: '$ratingsAverage' }, // Calculate average rating
        avgPrice: { $avg: '$price' }, // Calculate average price
        minPrice: { $min: '$price' }, // Calculate minimum price
        maxPrice: { $max: '$price' }, // Calculate maximum price
      },
    },
    {
      $sort: { avgPrice: 1 }, // Sort by average price in ascending order
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats, // Return the aggregated stats
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  // Aggregate tours to get the number of tours starting each month
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates', // Unwind the startDates array to process each date individually
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' }, // Group by month
        numToursStarts: { $sum: 1 }, // Count the number of tours starting in that month
        tours: { $push: '$name' }, // Collect tour names in an array
      },
    },
    {
      $addFields: { month: '$_id' }, // Add a month field to the output
    },
    {
      $project: { _id: 0 }, // Exclude the _id field from the output
    },
    {
      $sort: { numToursStarts: -1 }, // Sort by number of tours starting in descending order
    },
    {
      $limit: 12, // Limit the results to 12 months
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan, // Return the monthly plan data
    },
  });
});

// GET /tours-within/:distance/center/:latlng/unit/:unit
// GET /tours-within/600/center/34.111745,-118.2113491/unit/km

// 📍 Get tours within a certain distance from a given location
exports.getTourWithin = catchAsync(async (req, res, next) => {
  // 1️⃣ Extract parameters from the request
  const { distance, latlng, unit } = req.params;

  // 2️⃣ Split latlng into latitude and longitude
  const [lat, lng] = latlng.split(',').map((el) => Number(el));

  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400,
      ),
    );
  }

  // 3️⃣ Convert distance to radians based on the unit
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  console.log('distance', distance, 'lat:', lat, 'lng:', lng, 'unit:', unit);

  // 4️⃣ Find tours within the specified filter
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }, // Use geoWithin to find tours within the radius
  });
  if (!tours.length) {
    return next(
      new AppError('No tours found within the specified distance.', 404),
    );
  }

  // 5️⃣ Send the response with the found tours
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours, // Return the found tours
    },
  });
});

// GET /distance/:latlng/unit/:unit
// 📍 Get distances from a given location
exports.getDistances = catchAsync(async (req, res, next) => {
  // 1️⃣ Extract parameters from the request
  const { latlng, unit } = req.params;

  // 2️⃣ Split latlng into latitude and longitude
  const [lat, lng] = latlng.split(',').map((el) => Number(el));
  if (!lat || !lng) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400,
      ),
    );
  }
  console.log('lat:', lat, 'lng:', lng, 'unit:', unit);

  // 3️⃣ Calculate distances from the given location to all tours
  const unitMultiplier = unit === 'mi' ? 0.000621371 : 0.001; // Convert to miles or kilometers
  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1], // Convert to numbers
        },
        distanceField: 'distance', // Field to store the calculated distance
        distanceMultiplier: unitMultiplier,
      }, // 🗒️ $geoNear return all documents sorted by distance
    },
    {
      $project: {
        name: 1, //1: include, 0: exclude
        distance: 1,
        ratingsAverage: 1, // Include average rating in the output
      }, // Project only the name and distance fields
    },
  ]);

  // 5️⃣ Send the response with the found tours
  res.status(200).json({
    status: 'success',
    data: {
      data: distances, // Return the found tours
    },
  });
});
