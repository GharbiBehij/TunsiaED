import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { userRoutes } from './src/Modules/User/api/Routes/User.routes.js';
import { router as courseRouter } from './src/Modules/Course/api/Course.route.js';
import { router as paymentRouter } from './src/Modules/payment/Api/Payment.routes.js';
import { router as enrollmentRouter } from './src/Modules/Enrollement/Api/Routes/Enrollement.routes.js';
import { router as transactionRouter } from './src/Modules/Transaction/Api/routes/Transaction.routes.js';
import { router as chapterRouter } from './src/Modules/Chapter/Api/Chapter.routes.js';
import { router as lessonRouter } from './src/Modules/Lesson/Api/Lesson.routes.js';
import { router as quizRouter } from './src/Modules/Quiz/Api/Quiz.routes.js';
import { router as certificateRouter } from './src/Modules/Certificate/Api/Certificate.routes.js';
import { router as adminRouter } from './src/Modules/Admin/api/Admin.routes.js';
import { router as instructorRouter } from './src/Modules/Instructor/api/Instructor.routes.js';
import { router as studentRouter } from './src/Modules/Student/api/Student.routes.js';
import { router as progressRouter } from './src/Modules/Progress/api/Progress.routes.js';
import { registerPromoCodeRoutes } from './src/Modules/PromoCode/index.js';
import CartRouter from './src/Modules/Cart/api/Cart.routes.js';
import { initializeFirebaseNotifications } from './src/events/index.js';
import { seedSystemData } from './src/systemCourses/seedSystemCourses.js';
import { createRateLimiters } from './src/middlewares/rateLimiter.js';

const app = express();

// Initialize event system (Firebase notifications)
initializeFirebaseNotifications();
console.log('✅ Event system initialized');

// Seed system courses (only inserts if not already present)
seedSystemData().catch(err => console.warn('⚠️  System data seeding failed:', err.message));

// Security: Helmet for security headers
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for now (can enable later)
  crossOriginEmbedderPolicy: false // Allow embedding
}));

// Security: HTTPS redirect in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      return res.redirect(`https://${req.header('host')}${req.url}`);
    }
    next();
  });
}

// Allowed origins
const allowedOrigins = [
  'https://tunsiaed.web.app',
  'https://tunisiaed-811f6.web.app',
  'https://tunsiaed.firebaseapp.com',
  'http://localhost:3000',
  'http://localhost:3001'
];

// 1️ Global CORS middleware
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow non-browser requests
    if(allowedOrigins.indexOf(origin) === -1){
      return callback(new Error('CORS not allowed'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});
// 2 Handle preflight OPTIONS requests for all routes
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// 3 Raw body for Stripe webhook (MUST be before express.json())
app.use('/api/v1/payment/stripe/webhook', 
  express.raw({ type: 'application/json' })
);

// 3 Parse JSON
app.use(express.json());

// 3.5 Request logging
app.use(morgan('combined'));

// 3.6 Rate limiting (must be after body parsing)
const rateLimiters = createRateLimiters();
app.use('/api/v1/payment', rateLimiters.payment);
app.use('/api/v1/enrollment', rateLimiters.enrollment);
app.use('/api/v1', rateLimiters.general);

// 4️ Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'alive', 
    message: 'TunisiaED BFF is running',
    timestamp: new Date().toISOString() 
  });
});

// 5️ API Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/enrollment', enrollmentRouter);
app.use('/api/v1/transaction', transactionRouter);
app.use('/api/v1/chapter', chapterRouter);
app.use('/api/v1/lesson', lessonRouter);
app.use('/api/v1/quiz', quizRouter);
app.use('/api/v1/certificate', certificateRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/instructor', instructorRouter);
app.use('/api/v1/student', studentRouter);
app.use('/api/v1/progress', progressRouter);
app.use('/api/v1/shopping-cart', registerPromoCodeRoutes); // Promo code routes
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/cart',CartRouter)


// 6️ Global error handlerk
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500
  });
});

// 7️ 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
