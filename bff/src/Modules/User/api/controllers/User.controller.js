// api/controllers/User.controller.js
import { authService } from '../../service/User.service.js';

export class AuthController {
  async signup(req, res) {
    try {
      const result = await authService.signup(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message || 'Signup failed' });
    }
  }

  async login(req, res) {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({ error: error.message || 'Invalid credentials' });
    }
  }
}

export const authController = new AuthController();