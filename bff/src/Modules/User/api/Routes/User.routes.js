import express from 'express';
import { authenticate } from '../../../../middlewares/auth.middleware.js';
import * as userController from '../controllers/User.controller.js';

const router = express.Router();

router.post('/onboard', authenticate, userController.onboardUser);
router.get('/me', authenticate, userController.getMyProfile);
router.patch('/me', authenticate, userController.updateProfile);
router.delete('/me', authenticate, userController.deleteProfile);

export { router as userRoutes };
