// src/app.js
import './config/firebase.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { authenticate } from './middlewares/auth.middleware.js';
import { userRoutes } from './Modules/User/api/Routes/User.routes.js';
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();
const PORT = process.env.PORT ?? 3003;
const HOST = '0.0.0.0';

// Middleware setup
app.use(helmet());
app.use(cors({ origin: true }));
app.use(morgan('combined'));
app.use(express.json());

// Health check endpoint (before auth)
app.get('/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

// API routes
app.use('/api/v1', authenticate);
app.use('/api/v1/user', userRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, HOST, () => {
  console.log(`BFF server running on port ${PORT}`);
});

export default app;