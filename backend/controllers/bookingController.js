/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

// Create a Stripe checkout session
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1️⃣ Get the tour from the request parameters
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  // 2️⃣ Create JWT token for security
  const token = jwt.sign(
    { userId: req.user.id, tourId: req.params.tourId },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );

  // 3️⃣ Create a checkout session using Stripe
  const clientUrl =
    process.env.CLIENT_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://tours-app-omega.vercel.app'
      : 'http://localhost:5173');

  // Backend API URL for handling the success
  const backendUrl =
    process.env.NODE_ENV === 'production'
      ? 'toursapp-production.up.railway.app'
      : 'http://localhost:8000';

  const checkoutUrl = `${backendUrl}/api/v1/bookings/booking-success?session_id={CHECKOUT_SESSION_ID}&tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}&token=${token}`;
  const cancelUrl = `${clientUrl}/tour/${tour.slug}`;

  // 4️⃣ Create the Stripe checkout session
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

  // 5️⃣ Send the session to the client
  res.status(200).json({
    status: 'success',
    session,
  });
});

// Handle booking creation after successful payment
exports.handleBookingSuccess = catchAsync(async (req, res, next) => {
  const { tour, user, price, session_id, token } = req.query;

  console.log('🚀 handleBookingSuccess called!');
  console.log('🚀 Full URL:', req.url);
  console.log('🚀 Query params:', req.query);
  console.log('🚀 Headers:', req.headers);

  const clientUrl =
    process.env.CLIENT_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://tours-app-omega.vercel.app'
      : 'http://localhost:5173');

  // 1️⃣ JWT Token Verification
  if (!token) {
    console.error('❌ Missing token');
    return res.redirect(`${clientUrl}/booking-failed?error=missing_token`);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.userId !== user) {
      console.error('❌ Token userId mismatch');
      return res.redirect(`${clientUrl}/booking-failed?error=invalid_token`);
    }
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    return res.redirect(`${clientUrl}/booking-failed?error=expired_token`);
  }

  // 2️⃣ Required Parameter Verification
  if (!tour || !user || !price) {
    console.error('❌ Missing required parameters:', { tour, user, price });
    return res.redirect(`${clientUrl}/booking-failed?error=missing_params`);
  }

  try {
    // 3️⃣ Stripe Session Verification
    if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      console.log('💳 Stripe session status:', session.payment_status);

      if (session.payment_status !== 'paid') {
        console.error('❌ Payment not completed');
        return res.redirect(`${clientUrl}/booking-failed?error=payment_failed`);
      }
    }

    // 4️⃣ Check for Duplicate Bookings
    const existingBooking = await Booking.findOne({
      tour,
      user,
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }, // last 10 minutes
    });

    if (existingBooking) {
      console.log('✅ Booking already exists, skipping creation');
    } else {
      // 5️⃣ Create a new booking record
      const newBooking = await Booking.create({
        tour,
        user,
        price: Number(price),
        paid: true,
        status: 'planned',
        stripeSessionId: session_id,
      });
      console.log('✅ Booking created successfully:', newBooking._id);
    }

    // 6️⃣ Redirect to frontend success page
    return res.redirect(
      `${clientUrl}/booking-success?success=true&processed=true`,
    );
  } catch (error) {
    console.error('🚨 Failed to create booking:', error);
    // Even if booking creation fails, redirect to success page since payment is complete
    return res.redirect(
      `${clientUrl}/booking-success?success=true&warning=booking_creation_failed`,
    );
  }
});

// Legacy function - kept for compatibility
exports.createBookingCheckout = catchAsync(async (req, res, next) => next());

// Get all bookings for the current user
exports.getMyBookings = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id }).populate({
    path: 'tour',
    select: 'name slug imageCover startLocation startDates duration price',
  });

  res.status(200).json({
    status: 'success',
    data: {
      bookings,
    },
  });
});

// 添加到 bookingController.js
exports.testEndpoint = catchAsync(async (req, res, next) => {
  console.log('✅ Test endpoint reached!');
  console.log('Query params:', req.query);

  res.status(200).json({
    status: 'success',
    message: 'Test endpoint working',
    query: req.query,
  });
});

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
