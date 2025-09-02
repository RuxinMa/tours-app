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

if (process.env.NODE_ENV !== 'production') {
  const result = dotenv.config({ path: `${__dirname}/config.env` });
  if (result.error) {
    console.log('⚠️ No config.env file found, using environment variables');
  } else {
    console.log('✅ Loaded config.env file');
  }
} else {
  console.log('✅ Production mode: using Railway environment variables');
}

// 🔧 Production
const requiredEnvVars = ['DATABASE', 'DATABASE_PASSWORD', 'JWT_SECRET'];

console.log('🔍 Checking environment variables...');
const missingEnvVars = requiredEnvVars.filter((envVar) => {
  const value = process.env[envVar];
  console.log(`${envVar}: ${value ? '✅ Set' : '❌ Missing'}`);
  return !value;
});

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach((envVar) => {
    console.error(`   - ${envVar}`);
  });
  console.error('💡 Please check your Railway Variables configuration');
  process.exit(1);
}

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

console.log('🔗 Connecting to database...');

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
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

const server = app.listen(port, host, () => {
  console.log(`🚀 Server is running on Port: ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.name, err.message);
  console.log('Unhandled Rejection! 💥 Shutting down...');
  // Close the server and exit the process
  server.close(() => {
    process.exit(1);
  });
});
