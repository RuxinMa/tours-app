class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the parent constructor with the error message

    this.statusCode = statusCode; // Set the HTTP status code
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; // Determine if the error is a client error (4xx) or server error (5xx)
    this.isOperational = true; // Indicate that this is an operational error

    Error.captureStackTrace(this, this.constructor); // Capture the stack trace for debugging
  }
}

module.exports = AppError;
