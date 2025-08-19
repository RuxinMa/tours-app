/* eslint-disable import/no-extraneous-dependencies */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1️⃣ Get the tour from the request parameters
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  // 2️⃣ Create a checkout session using Stripe
  const checkoutUrl = `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`;
  const cancelUrl = `${req.protocol}://${req.get('host')}/tour/${tour.slug}`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: checkoutUrl,
    cancel_url: cancelUrl,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: 'payment',
    line_items: [
      {
        price_data: {
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
          },
          unit_amount: tour.price * 100, // Amount is in cents
          currency: 'aud',
        },
        quantity: 1,
      },
    ],
  });

  // console.log('✅ Checkout session created:', session.id);

  // 3️⃣ Send the session to the client
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // 1️⃣ Check if the query parameters contain the necessary data
  const { tour, user, price } = req.query;

  // 🔥 Change the check logic - if no parameters, skip to next middleware
  if (!tour || !user || !price) {
    return next();
  }

  try {
    // 2️⃣ Create a new booking in the database
    await Booking.create({ tour, user, price });

    // 3️⃣ Redirect to the overview page
    return res.redirect(req.originalUrl.split('?')[0]);
  } catch (error) {
    return next();
  }
});

// Get all bookings for the current user
exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name imageCover startLocation startDates duration price',
  });

  res.status(200).json({
    status: 'success',
    data: {
      bookings,
    },
  });
});

// Update booking status (e.g., confirm, cancel)
exports.updateBookingStatus = catchAsync(async (req, res, next) => {
  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  );

  if (!booking) {
    return next(new AppError('Booking not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      booking,
    },
  });
});

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
