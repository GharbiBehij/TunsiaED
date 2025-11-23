import express from 'express';
import cors from 'cors';
import { userRoutes } from './src/Modules/User/api/Routes/User.routes.js';
import { router as courseRouter } from './src/Modules/Course/api/Course.route.js';
import { router as paymentRouter } from './src/Modules/payment/Api/Payment.routes.js';
import { router as enrollmentRouter } from './src/Modules/Enrollement/Api/Routes/Enrollement.routes.js';
import { router as transactionRouter } from './src/Modules/Transaction/Api/routes/Transaction.routes.js';

const app = express();

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

// 3 Parse JSON
app.use(express.json());

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

// 6️ 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
