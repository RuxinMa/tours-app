/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const fs = require('fs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

dotenv.config({ path: './config.env' }); // import from CWD (current working directory)

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    console.log('✅ DB connection successful!');
  })
  .catch((err) => {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  });

// Read tours/users/reviews data from JSON file
const tours = fs.readFileSync(`${__dirname}/tours.json`, 'utf-8');
const users = fs.readFileSync(`${__dirname}/users.json`, 'utf-8');
const reviews = fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8');

// Import tours data into the database
const importData = async () => {
  try {
    await Tour.create(JSON.parse(tours)); // Parse JSON and create Tour documents
    await User.create(JSON.parse(users), { validateBeforeSave: false }); // Parse JSON and create User documents without validation
    await Review.create(JSON.parse(reviews));
    console.log('✅ Data successfully loaded!');
  } catch (err) {
    console.error('❌ Error importing data:', err);
  }
  process.exit(); // Exit the process after import
};

// Delete all tours data from Collection
const deleteData = async () => {
  try {
    await Tour.deleteMany(); // Delete all documents in the Tour collection
    await User.deleteMany(); // Delete all documents in the User collection
    await Review.deleteMany(); // Delete all documents in the Review collection
    console.log('✅ Data successfully deleted!');
  } catch (err) {
    console.error('❌ Error deleting data:', err);
  }
  process.exit(); // Exit the process after deletion
};

if (process.argv[2] === '--import') {
  importData(); // Import data if the command line argument is --import
} else if (process.argv[2] === '--delete') {
  deleteData(); // Delete data if the command line argument is --delete
} else {
  console.log('Please provide a valid argument: --import or --delete');
}

console.log(process.argv); // Log command line arguments
