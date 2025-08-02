/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

// Multer configuration for file uploads to disk
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users'); // callback function
//   },
//   filename: (req, file, cb) => {
//     // user-49db939b9d9b-202503180904.jpg
//     // user-<userId>-<timestamp>.<ext>
//     const ext = file.mimetype.split('/')[1]; // Get the file extension from the MIME type
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`); // Set the filename format
//   },
// });

// Use memory storage for processing images in memory (🔑 as buffer)
const multerStorage = multer.memoryStorage();

// Filter function to check if the uploaded file is an image
const multerFilter = (req, file, cb) => {
  // Check if the uploaded file is an image
  if (file.mimetype.startsWith('image')) {
    cb(null, true); // Accept the file
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false); // Reject the file
  }
};

const upload = multer({
  storage: multerStorage, // Set the storage engine
  fileFilter: multerFilter, // Set the file filter
});

// Middleware to handle file uploads
exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(); // If no file is uploaded, skip resizing

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

// Utility function to filter out unwanted fields from the request body
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Handlers for the user routes
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file);
  // console.log(req.body);

  // 1️⃣ Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400,
      ),
    );
  }
  // 2️⃣ Filter out unwanted fields from req.body
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename; // 🏞️ If a photo is uploaded, add it to the filtered body

  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredBody, // Update only name and email
    {
      new: true, // Return the updated document
      runValidators: true, // Run validators on the updated fields
    },
  );

  // 3️⃣ Return the updated user
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser, // Return the updated user data
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false }); // Soft delete the user by setting active to false
  res.status(204).json({
    status: 'success',
    data: null,
  }); // Return a 204 No Content status
});

// ONLY FOR ADMIN USE
exports.getAllUsers = factory.getAll(User);
exports.getUserbyId = factory.getOne(User); // No populate options needed
exports.createUser = factory.createOne(User); // Create a new user
exports.updateUser = factory.updateOne(User); //❗️do not use update password here
exports.deleteUser = factory.deleteOne(User);
