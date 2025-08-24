const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// Define the router
const router = express.Router();

// Authentication routes without protection
router.post('/signup', authController.signup); // Route for user signup
router.post('/login', authController.login); // Route for user login
router.get('/logout', authController.logout); // Route for user logout
router.post('/forgotPassword', authController.forgotPassword); // Route for forgot password
router.patch('/resetPassword/:token', authController.resetPassword); // Route for resetting password

// 🔐 Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword); // Route for updating password
router.get('/me', userController.getMe, userController.getUserbyId); // Route to get current user data (current user)
router.patch(
  '/updateMe',
  userController.uploadUserPhoto, // Middleware to handle file uploads
  userController.resizeUserPhoto, // Middleware to resize the uploaded photo
  userController.updateMe,
); // Route for updating current user data
router.delete('/deleteMe', userController.deleteMe); // Route for soft deleting user

// 🔒 Admin routes
router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUserbyId)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
