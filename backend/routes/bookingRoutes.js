const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// ===== PUBLIC ROUTES (for Stripe callbacks) =====
router.get('/booking-success', bookingController.handleBookingSuccess);

// ===== PROTECTED ROUTES =====
router.use(authController.protect);

// ===== USER ROUTES =====
router.get('/user/me', bookingController.getMyBookings);
router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);
router.post('/user/create', bookingController.createUserBooking);

// ===== ADMIN/LEAD-GUIDE ROUTES =====
router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
