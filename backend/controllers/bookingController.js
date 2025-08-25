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

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1️⃣ Get the tour from the request parameters
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(new AppError('Tour not found', 404));
  }

  // 2️⃣ Generate temporary token for authentication in callback
  const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  // 3️⃣ Create a checkout session using Stripe
  const serverUrl =
    process.env.SERVER_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://toursapp-production.up.railway.app'
      : 'http://localhost:8000');

  const clientUrl =
    process.env.CLIENT_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://tours-app-omega.vercel.app'
      : 'http://localhost:5173');

  const checkoutUrl = `${serverUrl}/api/v1/bookings/booking-success?session_id={CHECKOUT_SESSION_ID}&tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}&token=${token}`;
  const cancelUrl = `${clientUrl}/tour/${tour.slug}`;

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

  // 4️⃣ Send the session to the client
  res.status(200).json({
    status: 'success',
    session,
  });
});

// Handle booking success after Stripe payment
exports.handleBookingSuccess = catchAsync(async (req, res, next) => {
  const { tour, user, price, session_id, token } = req.query;

  // 1️⃣ Validate token
  if (!token) {
    return res.redirect(
      `${process.env.CLIENT_URL}/booking-failed?error=missing_token`,
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 2️⃣ Ensure token userId matches request userId
    if (decoded.userId !== user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/booking-failed?error=invalid_token`,
      );
    }
  } catch (error) {
    return res.redirect(
      `${process.env.CLIENT_URL}/booking-failed?error=expired_token`,
    );
  }

  // 3️⃣ Validate required parameters
  if (!tour || !user || !price) {
    return res.redirect(
      `${process.env.CLIENT_URL}/booking-failed?error=missing_params`,
    );
  }

  try {
    // 4️⃣ Verify Stripe session
    if (session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      if (session.payment_status !== 'paid') {
        return res.redirect(
          `${process.env.CLIENT_URL}/booking-failed?error=payment_failed`,
        );
      }
    }

    // 5️⃣ Check if booking already exists (prevent duplicates)
    const existingBooking = await Booking.findOne({
      tour,
      user,
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }, // Within last 10 minutes
    });

    if (!existingBooking) {
      // 6️⃣ Create new booking
      const newBooking = await Booking.create({
        tour,
        user,
        price: Number(price),
        paid: true,
        status: 'pending-review',
      });
      console.log('✅ Booking created successfully:', newBooking._id);
    } else {
      console.log('✅ Booking already exists, skipping creation');
    }

    // 7️⃣ Redirect to frontend success page
    return res.redirect(
      `${process.env.CLIENT_URL}/booking-success?success=true`,
    );
  } catch (error) {
    console.error('🚨 Failed to create booking:', error);
    // Even if booking creation fails, redirect to success since payment completed
    return res.redirect(
      `${process.env.CLIENT_URL}/booking-success?success=true&warning=booking_creation_failed`,
    );
  }
});

// Legacy function - kept for compatibility
exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) {
    return next();
  }

  try {
    // Check if booking already exists
    const existingBooking = await Booking.findOne({
      tour,
      user,
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
    });

    if (!existingBooking) {
      await Booking.create({
        tour,
        user,
        price: Number(price),
        paid: true,
        status: 'pending-review',
      });
      console.log('✅ Legacy booking created');
    }

    return res.redirect(req.originalUrl.split('?')[0]);
  } catch (error) {
    console.error('🚨 Legacy booking creation failed:', error);
    return next();
  }
});

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
