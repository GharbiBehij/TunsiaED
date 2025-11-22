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

app.listen(PORT, HOST, () => {
  console.log(`BFF running → https://tunsiaed.onrender.com`);
});

app.use(helmet());
app.use(cors({ origin: true }));
app.use(morgan('combined'));
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'OK', time: new Date() }));

app.use('/api/v1', authenticate);
app.use('/api/v1/user', userRoutes);   // ← THIS IS CORRECT (singular)

app.use(errorHandler);

export default app;