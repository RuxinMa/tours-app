const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');

// Define the router
const router = express.Router();

// 🧡 Nested routes (=middleware) for reviews
router.use('/:tourId/reviews', reviewRouter);

router.route('/slug/:slug').get(tourController.getTourBySlug); // GET tour by slug

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours); // Middleware for top 5 cheap tours

router.route('/tour-stats').get(tourController.getTourStats); // GET tour statistics

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  ); // GET monthly plan for a specific year

// 📍 Tours within a certain distance from a given location
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getTourWithin);
// 查找悉尼周围1000公里内的tours
// GET /api/v1/tours/tours-within/1000/center/-33.8688,151.2093/unit/km

// Distances from a given location
router.route('/distance/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours) // GET all tours
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'), // Middleware to restrict access
    tourController.createTour,
  ); // POST a new tour, requires admin or lead-guide role

router
  .route('/:id')
  .get(tourController.getTourbyId) // GET a tour by ID
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.uploadTourImages, // Middleware to handle image uploads
    tourController.resizeTourImages, // Middleware to resize images
    tourController.updateTour,
  ) // PATCH to update a tour, requires admin or lead-guide role
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  ); // DELETE a tour by ID, requires admin or lead-guide role

// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTourbyId);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

module.exports = router;
