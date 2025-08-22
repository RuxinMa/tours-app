const express = require('express');
const bookingController = require('../controllers/bookingController');
const authController = require('../controllers/authController');

const router = express.Router();

// ===== PROTECTED ROUTES =====
router.use(authController.protect);

// ===== USER ROUTES =====
router.get('/user/me', bookingController.getMyBookings);

// 获取 checkout session (创建支付会话)
router.get('/checkout-session/:tourId', bookingController.getCheckoutSession);

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
