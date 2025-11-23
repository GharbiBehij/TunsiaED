// app.js or server.js
import express from 'express';
import cors from 'cors';
import { userRoutes } from '../src/Modules/User/api/Routes/User.routes';
import { router as courseRouter } from './src/modules/Course/api/Course.route.js';
import { router as paymentRouter } from './src/modules/payment/Api/Payment.routes.js';
import { router as enrollmentRouter } from './src/modules/Enrollement/Api/Routes/Enrollement.routes.js';
import { router as transactionRouter } from './src/modules/Transaction/Api/routes/Transaction.routes.js';

const app = express();

// 1. Middleware FIRST
app.use(cors({
  origin: ['https://tunsiaed.web.app', 'https://tunsiaed.firebaseapp.com', 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']}));
app.use(express.json());

// 2. Health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'alive', 
    message: 'TunisiaED BFF is running',
    timestamp: new Date().toISOString() 
  });
});

// 3. API Routes BEFORE 404 handler
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/course', courseRouter);
app.use('/api/v1/payment', paymentRouter);
app.use('/api/v1/enrollment', enrollmentRouter);
app.use('/api/v1/transaction', transactionRouter);

// 4. 404 handler LAST
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;