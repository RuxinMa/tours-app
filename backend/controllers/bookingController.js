/* eslint-disable camelcase */
/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

// Create a Stripe checkout session
exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  console.log('=== getCheckoutSession START ===');
  console.log('Tour ID:', req.params.tourId);
  console.log('User ID:', req.user && req.user.id);
  console.log('Environment:', process.env.NODE_ENV);

  try {
    // 1️⃣ Get the tour from the request parameters
    console.log('Step 1: Finding tour...');
    const tour = await Tour.findById(req.params.tourId);
    console.log('Tour found:', !!tour);

    if (!tour) {
      console.error('Tour not found for ID:', req.params.tourId);
      return next(new AppError('Tour not found', 404));
    }
    console.log('Tour details:', { name: tour.name, price: tour.price });

    // 2️⃣ Setup URLs
    console.log('Step 2: Setting up URLs...');
    const clientUrl =
      process.env.CLIENT_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://tours-app-omega.vercel.app'
        : 'http://localhost:5173');

    const backendUrl =
      process.env.NODE_ENV === 'production'
        ? 'https://toursapp-production.up.railway.app'
        : 'http://localhost:8000';

    console.log('Client URL:', clientUrl);
    console.log('Backend URL:', backendUrl);

    const checkoutUrl = `${backendUrl}/api/v1/bookings/booking-success?session_id={CHECKOUT_SESSION_ID}`;
    console.log('Checkout URL:', checkoutUrl);

    // 3️⃣ Create the Stripe checkout session
    console.log('Step 3: Creating Stripe session...');
    console.log('User email:', req.user.email);
    console.log('Tour price:', tour.price);

    const sessionData = {
      payment_method_types: ['card'],
      success_url: checkoutUrl,
      cancel_url: `${clientUrl}/tour/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
      mode: 'payment',
      metadata: {
        tourId: req.params.tourId,
        userId: req.user.id,
        price: tour.price.toString(),
        tourName: tour.name,
      },
      line_items: [
        {
          price_data: {
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
            },
            unit_amount: tour.price * 100,
            currency: 'aud',
          },
          quantity: 1,
        },
      ],
    };

    console.log('Session data prepared:', JSON.stringify(sessionData, null, 2));

    const session = await stripe.checkout.sessions.create(sessionData);
    console.log('Stripe session created successfully, ID:', session.id);

    // 4️⃣ Send response
    console.log('Step 4: Sending response...');
    res.status(200).json({
      status: 'success',
      session,
    });
    console.log('Response sent successfully');
  } catch (error) {
    console.error('=== ERROR in getCheckoutSession ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error code:', error.code);
    console.error('Error type:', error.type);
    console.error('===============================');

    return next(new AppError(`Checkout session failed: ${error.message}`, 500));
  }
});

// Handle booking creation after successful payment
exports.handleBookingSuccess = catchAsync(async (req, res, next) => {
  const { session_id } = req.query;

  const clientUrl =
    process.env.CLIENT_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://tours-app-omega.vercel.app'
      : 'http://localhost:5173');

  // 1️⃣ Session Verification
  if (!session_id) {
    console.error('Missing session_id');
    return res.redirect(`${clientUrl}/booking-failed?error=missing_session`);
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== 'paid') {
      console.error('Payment not completed');
      return res.redirect(`${clientUrl}/booking-failed?error=payment_failed`);
    }

    // 2️⃣ Required Parameter Verification
    const { tourId, userId, price } = session.metadata;

    if (!tourId || !userId || !price) {
      console.error('Missing required metadata:', { tourId, userId, price });
      return res.redirect(`${clientUrl}/booking-failed?error=missing_data`);
    }

    // 3️⃣ Create a new booking
    const newBooking = await Booking.create({
      tour: tourId,
      user: userId,
      price: Number(price),
      paid: true,
      status: 'planned',
      stripeSessionId: session_id,
    });
    console.log('Booking created successfully:', newBooking._id);

    // 4️⃣ Redirect to success page
    return res.redirect(
      `${clientUrl}/booking-success?success=true&processed=true`,
    );
  } catch (error) {
    console.error('Failed to process booking:', error);
    return res.redirect(
      `${clientUrl}/booking-success?success=true&warning=booking_creation_failed&processed=true`,
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

exports.getAllBookings = factory.getAll(Booking);
exports.getBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
