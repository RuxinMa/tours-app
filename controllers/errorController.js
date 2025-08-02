/* eslint-disable no-console */
const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`; // Create a custom error message
  return new AppError(message, 400); // Return 400: Bad Request for invalid input
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]; // Extract the duplicate value from the error message
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message); // Extract validation error messages

  const message = `Invalid input data. ${errors.join('. ')}`; // Join the messages into a single string
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
  new AppError('Invalid token. Please log in again!', 401); // Return 401: Unauthorized for invalid JWT

const sendErrorDev = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) RENDERED WEBSITE
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      // ♨️ Operational errors: Send message and status code to client
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // 💢 Programming or all unknown errors: don't leak details to the client
    // 1) Log error for debugging
    console.error('ERROR 💥:', err);
    // 2) Send generic message to client
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
  // B) RENDERED WEBSITE
  // ♨️ Operational errors: Render error page with message
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // 💢 Programming or all unknown errors
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; // Set default status code if not provided
  err.status = err.status || 'error'; // Set default status if not provided

  if (process.env.NODE_ENV === 'development') {
    // In development, send detailed error information
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, name: err.name, message: err.message }; // Create a shallow copy of the error object

    if (error.name === 'CastError') error = handleCastErrorDB(error); // Handle MongoDB CastError as an operational error
    if (error.code === 11000) error = handleDuplicateFieldsDB(error); // Handle MongoDB duplicate field error
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error); // Handle MongoDB validation error
    if (error.name === 'JsonWebTokenError') {
      error = handleJsonWebTokenError(error); // Handle JWT errors
    }
    // In production, send generic error message
    sendErrorProd(error, res);
  }
};

module.exports = (err, req, res, next) => {
  const safeErr = err || new Error('Unknown error');
  safeErr.statusCode = safeErr.statusCode || 500;
  safeErr.status = safeErr.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(safeErr, req, res);
  } else {
    sendErrorProd(safeErr, req, res);
  }
};
