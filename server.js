/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Before starting the server
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.name, err.message);
  console.log('Uncaught Exception! 💥 Shutting down...');

  process.exit(1);
});

// Load environment variables from config.env file
dotenv.config({ path: `${__dirname}/config.env` });
// console.log(process.env);

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

// Connect to MongoDB using Mongoose
mongoose
  .connect(DB)
  .then(() => {
    console.log('✅ DB connection successful!');
  })
  .catch((err) => {
    console.error('❌ DB connection error:', err);
    process.exit(1);
  });

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`🚀 Server is running on Port: ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.name, err.message);
  console.log('Unhandled Rejection! 💥 Shutting down...');
  // Close the server and exit the process
  server.close(() => {
    process.exit(1);
  });
});
