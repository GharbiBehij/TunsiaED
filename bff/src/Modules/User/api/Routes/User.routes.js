import { Router } from 'express';
import { authController } from '../controllers/User.controller.js';
import { validateBody } from '../../../../middlewares/validation.middleware.js';
import { CreateUserRequest, LoginUserRequest } from '../../dto/User.request.dto.js';
const router = Router();

router.post('/signup', validateBody(CreateUserRequest), authController.signup);
router.post('/login', validateBody(LoginUserRequest), authController.login);

export { router };



