import express from 'express';
import { authenticate } from '../../../../middlewares/auth.middleware.js';
import { requireRole } from '../../../../middlewares/Role.middleware.js';
import * as userController from '../controllers/User.controller.js';

const router = express.Router();

router.post('/onboard', authenticate, userController.onboardUser);
router.get('/me', authenticate, userController.getMyProfile);
router.patch('/me', authenticate, userController.updateProfile);
router.delete('/me', authenticate, userController.deleteProfile);

// Admin-only endpoint to get safe Firebase user info
router.get('/firebase/:userId', authenticate, requireRole('admin'), userController.getFirebaseUserInfo);

export { router as userRoutes };
