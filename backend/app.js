/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

// Import sub-application routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes'); // Import bookings routes if needed
const viewRoutes = require('./routes/viewRoutes');

// Import custom error handling utility
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController'); // Import global error handler

// Initialize the Express application
const app = express();

// 1️⃣ Set the view engine to Pug 模板引擎配置
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // join the views directory to the current directory

// 2️⃣ Serving static files 静态文件配置（必须在路由前）
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(`${__dirname}/public`));

// 3️⃣ GLOBAL MIDDLEWARES
// Enable CORS (Cross-Origin Resource Sharing)
if (process.env.NODE_ENV === 'development') {
  app.use(
    cors({
      origin: ['http://localhost:8000', 'http://localhost:5173'],
      credentials: true,
    }),
  );
}

if (process.env.NODE_ENV === 'production') {
  const allowedOrigins = [
    'https://tours-app-omega.vercel.app', // Vercel Frontend Domain
    process.env.CLIENT_URL, // Environment Variable (if set)
    'http://localhost:8000', // Local Testing
    'http://localhost:5173', // Local Testing
  ].filter(Boolean); // Remove undefined values

  console.log('🌍 Production CORS enabled for:', allowedOrigins);

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
      ],
    }),
  );
}

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://fonts.googleapis.com', // Google Fonts CSS
          'https://api.mapbox.com', // Mapbox CSS
        ],
        fontSrc: [
          "'self'",
          'https://fonts.gstatic.com', // Google Fonts
        ],
        scriptSrc: [
          "'self'",
          'https://api.mapbox.com', // 🔧 Mapbox JS
          'https://js.stripe.com',
          'https://cdnjs.cloudflare.com',
        ],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: [
          "'self'",
          'https://api.mapbox.com',
          'https://events.mapbox.com',
        ],
        workerSrc: ["'self'", 'blob:'],
        frameSrc: [
          "'self'",
          'https://checkout.stripe.com',
          'https://js.stripe.com',
        ],
      },
    },
  }),
);

// Development logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // Use morgan for logging HTTP requests in development mode
}

// Limit requests from the same IP address
const limiter = rateLimit({
  max: 500, // Limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Parse JSON bodies, reading data from the req.body
app.use(express.json({ limit: '10kb' })); // Limit the size of JSON payloads
app.use(cookieParser()); // Parse cookies from the request headers

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS (Cross-Site Scripting)
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ], // Allow these fields to be passed in query parameters
  }),
);

// Compress responses to reduce size
app.use(compression());

/* Test Custom Middleware: Log */
app.use((req, res, next) => {
  console.log(); // Log the request to the console
  console.log('Hello from the middleware! 👋');
  next(); // Call the next middleware or route handler
});

/* Test Custom Middleware: Add Timestamp */
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString(); // 🔖 Add a request time property to the request object
  // console.log(req.cookies); // 📬 Log the cookies to the console
  next();
});

// 4️⃣ ROUTES (Define after middleware)
// 4.1 🌐 View Routes
app.use('/', viewRoutes); // Use the view routes for rendering Pug templates

// 4.2 📊 API Routes
app.use('/api/v1/tours', tourRouter); // middleware for tour routes
app.use('/api/v1/users', userRouter); // middleware for user routes
app.use('/api/v1/reviews', reviewRouter); // middleware for review routes
app.use('/api/v1/bookings', bookingRouter); // middleware for bookings routes if needed

// 4.3 ⛔️ Catch-all Route for undefined routes
app.use((req, res, next) => {
  const ignorePaths = [
    '/.well-known/appspecific/com.chrome.devtools.json',
    '/bundle.js.map',
    '/favicon.ico',
  ];
  if (
    ignorePaths.includes(req.originalUrl) ||
    req.originalUrl.endsWith('.map')
  ) {
    return res.status(204).end();
  }
  next();
}); // Pass control to the next middleware or route handler

app.all('*', (req, res, next) => {
  // 404 Handler for undefined routes
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // Use the AppError class to create a new error and pass it to the next middleware
});

app.use(globalErrorHandler); // Use the global error handler for all errors

// 5️⃣ START SERVER (moved to server.js - starting point of the application)
module.exports = app;
