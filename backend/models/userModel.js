/* eslint-disable import/no-extraneous-dependencies */
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Field: name email photo password passwordConfirm
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'], // Ensure name is provided
      trim: true, // Remove leading and trailing spaces
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'], // Ensure email is provided
      unique: true,
      lowercase: true, // Convert email to lowercase
      validate: [validator.isEmail, 'Please provide a valid email'], // Custom validation for email format
    },
    photo: {
      type: String,
      default: 'default.jpg', // Default photo if none is uploaded
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'], // Allowed roles
      default: 'user', // Default role is user
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false, // Exclude password from queries by default
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm your password'],
      validate: {
        // Custom validation: 🍒 this only works on CREATE and SAVE!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords do not match, please try again!',
      },
    },
    passwordChangedAt: Date, // To track when the password was changed
    passwordResetToken: String, // Hashed token for password reset
    passwordResetExpires: Date, // Expiration time for the password reset token
    active: {
      type: Boolean,
      default: true, // Default to active user
      select: false, // Exclude from queries by default
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// ❇️ Middleware to hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // 🌀Hash the password using bcrypt
  this.password = await bcrypt.hash(this.password, 12); // Hash the password with a salt round of 12
  this.passwordConfirm = undefined; // Remove passwordConfirm field after hashing
  // Continue to the next middleware
  next();
});

// ❇️ Middleware to set passwordChangedAt field
userSchema.pre('save', function (next) {
  // If the password was not modified, skip this step
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure the JWT is issued after this time (database consistency)
  next();
});

// ☀️ Query Middleware to exclude inactive users from queries
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } }); // Exclude users where active is false
  next();
});

// Method to check if the provided password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  // Compare the candidate password with the stored hashed password
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Method to check if the password was changed after the JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    ); // Convert to seconds
    return JWTTimestamp < changedTimestamp; // Return true if JWT was issued before password change
  }
  return false; // default to false, indicating no password change after token issuance
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex'); // Generate a random token

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex'); // Hash the token for storage

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Set expiration time for the token (10 minutes)

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
