const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1️⃣ Get all tours from collection
  const tours = await Tour.find();

  // 2️⃣ Build temaplate
  // 3️⃣ Render the template using tour data
  res.status(200).render('overview', {
    title: 'All Tours',
    tours, // array of tours to be passed to the Pug template
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1️⃣ Get the data for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('No tour found with that name', 404));
  }

  // 2️⃣ Build template
  // 3️⃣ Render template using the data from the requested tour
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour, // single tour object to be passed to the Pug template
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  // Render the login form
  res.status(200).render('login', {
    title: 'Log into your account',
  });
});

exports.getAccount = catchAsync(async (req, res, next) => {
  // Render the user's account page
  res.status(200).render('account', {
    title: 'Your Account',
    user: req.user, // user object to be passed to the Pug template
  });
});

// exports.getMyTours = catchAsync(async (req, res, next) => {
//   // 1) Find all bookings
//   const bookings = await Booking.find({ user: req.user.id });

//   // 2) Find tours with the returned IDs
//   const tourIDs = bookings.map((el) => el.tour);
//   const tours = await Tour.find({ _id: { $in: tourIDs } });

//   // 3) Render the template with the tours data
//   res.status(200).render('overview', {
//     title: 'My Tours',
//     tours,
//   });
// });

exports.getMyTours = catchAsync(async (req, res, next) => {
  try {
    // 1) Find all bookings for this user
    const bookings = await Booking.find({ user: req.user.id });

    if (bookings.length === 0) {
      return res.status(200).render('overview', {
        title: 'My Tours - No bookings yet',
        tours: [],
      });
    }

    // 2) Find tours with the returned IDs
    const tourIDs = bookings.map((el) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });

    // 3) Render the template with the tours data
    res.status(200).render('overview', {
      title: 'My Tours',
      tours,
    });
  } catch (error) {
    next(error);
  }
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});
