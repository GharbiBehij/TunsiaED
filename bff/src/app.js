// src/app.ts
// BFF Server - Acts as API Gateway for the E-Platform
import './config/firebase.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import { router as userRoutes } from './Modules/User/api/Routes/User.routes.js';
import { errorHandler } from './middlewares/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Gateway Middleware
app.use(helmet()); // Security headers
app.use(cors()); // CORS handling (configure origins as needed)
app.use(morgan('combined')); // Request logging
app.use(express.json()); // JSON body parser
// TODO: Add rate limiting middleware (e.g., express-rate-limit)

// Health Checks
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/api/v1/status', (req, res) => {
  res.json({ message: 'E-Platform BFF Server is running' });
});

app.get('/api/v1/firebase/health', async (req, res) => {
  try {
    const firebaseApp = admin.app();
    const projectId = firebaseApp.options.projectId || process.env.FIREBASE_PROJECT_ID;
    res.json({ ok: true, projectId });
  } catch (err) {
    res.status(500).json({ ok: false, error: err?.message || 'Firebase unavailable' });
  }
});

// API Routes
app.use('/api/v1/auth', userRoutes);


// Error Handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(` E-Platform BFFGateway running on port ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(` API endpoint: http://localhost:${PORT}/api/v1`);
});

export default app;