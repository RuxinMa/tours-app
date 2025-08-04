/* eslint-disable import/no-extraneous-dependencies */
const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync'); // Import the catchAsync utility
const AppError = require('../utils/appError');
const Email = require('../utils/email'); // Import the Email utility for sending emails

// Function to generate a JWT token
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res, message) => {
  const token = signToken(user.id); // Generate a JWT token for the user
  const cookieExpiresIn = parseInt(process.env.JWT_COOKIE_EXPIRES_IN, 10) || 90;
  const expirationDate = new Date(
    Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000,
  ); // Set the cookie expiration date

  const cookieOptions = {
    expires: expirationDate,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // only https in production

  res.cookie('jwt', token, cookieOptions); // Set the JWT token in a cookie

  user.password = undefined; // Remove the password from the response

  res.status(statusCode).json({
    status: 'success',
    token, // Include the JWT token in the response
    data: {
      user, // Return the user data
    },
    message: message || 'Operation successful', // Custom message or default
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // ❌ DANGEROUS: This allows ANY field from the request to be saved!
  // const newUser = await User.create(req.body);

  // ✅ SECURE: Extract user data from request body
  const newUser = await User.create({
    // Only allow specific, expected fields
    name: req.body.name,
    email: req.body.email,
    role: req.body.role || 'user', // Default role is 'user'
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  }); // role, permissions, etc. are NOT included

  // SEND EMAIL
  // url = 'http://localhost:8000/me'
  const url = `${req.protocol}://${req.get('host')}/me`;
  new Email(newUser, url).sendWelcome(); // Send a welcome email to the new user

  // JWT TOKEN
  createSendToken(newUser, 201, res, 'User created successfully');
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1️⃣ Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2️⃣ Check is user exists && password is correct
  const user = await User.findOne({ email }).select('+password'); // Include password field for comparison
  //                               ▶  candidatePassword, userPassword
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401)); // Unauthorized error
  }

  // 3️⃣ If everything is ok, send token to client
  createSendToken(user, 200, res, 'User logged in successfully');
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000), // Set cookie to expire in 10 seconds
    httpOnly: true,
  }); // cookieOptions

  res.status(200).json({
    status: 'success',
    message: 'User logged out successfully',
  });
});

// 🔐 Middleware to protect routes
exports.protect = catchAsync(async (req, res, next) => {
  // 1️⃣ Get token and check if it exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt; // Extract the token from cookies
  }
  // console.log('Token:', token);
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401),
    );
  }

  // 2️⃣ Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log('Decoded Token:', decoded);

  // 3️⃣ Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401,
      ), // Unauthorized error
    );
  }

  // 4️⃣ If user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401),
    );
  }

  // 5️⃣ Grant access to protected route
  req.user = currentUser;
  res.locals.user = currentUser; // Logged in user data available in views
  next();
});

// Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      // 1) verify token
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) {
        return next();
      }

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // THERE IS A LOGGED IN USER
      res.locals.user = currentUser;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

// 🔏 Middleware to restrict access to certain roles
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles is an array of allowed roles
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action.',
          403, // Forbidden error
        ),
      );
    }
    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1️⃣ Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address'), 404);
  }

  // 2️⃣ Generate the random reset token
  const resetToken = user.createPasswordResetToken(); // unhashed token - sending to user
  // console.log('Reset Token:', resetToken);
  // console.log('Hashed Token:', user.passwordResetToken);
  await user.save({ validateBeforeSave: false }); // Save the user with the reset token

  // 3️⃣ Send it back as an email
  try {
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    // 4️⃣ Respond to the request
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined; // Clear the reset token
    user.passwordResetExpires = undefined; // Clear the expiration time
    await user.save({ validateBeforeSave: false }); // Save the user without the reset token

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500, // Internal Server Error
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1️⃣ Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex'); // Hash token from the request parameters, compared to the stored hashed token

  // console.log('User Token:', hashedToken);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Check if the token has not expired
  });
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400)); // Bad Request error
  }

  // 2️⃣ If token has not expired, and there is user, set the new password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined; // Clear the reset token
  user.passwordResetExpires = undefined; // Clear the expiration time
  await user.save(); // Save the updated user

  // 3️⃣ Update changedPasswordAt property for the user (middleware handles this)
  // 4️⃣ Log the user in, send JWT
  createSendToken(user, 200, res, 'Password reset successfully');
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1️⃣ Get user from the collection
  const user = await User.findById(req.user.id).select('+password'); // Include password field for comparison

  // 2️⃣ Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401)); // Unauthorized error
  }

  // 3️⃣ If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save(); // Save the updated user
  // cannot use User.findByIdAndUpdate, because not trigger pre-save middleware for password hashing

  // 4️⃣ Log user in, send JWT
  createSendToken(user, 200, res, 'Password updated successfully'); // Send the token and user data in the response
});
