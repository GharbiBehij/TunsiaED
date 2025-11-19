// services/Auth.service.js
import { userRepository } from '../repository/User.repository.js';
import { UserMapper } from '../mapper/User.mapper.js';
import { generateJWT } from '../../../utils/jwt.js';
import { comparePassword } from '../../../utils/password.js';
import { hashPassword } from '../../../utils/password.js';

export class AuthService {
  async signup(data) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await userRepository.createUser(data, hashedPassword);
    const token = generateJWT({ userId: user.UserId, role: user.role });

    return UserMapper.toResponse(user, token);
  }

  async login(data) {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const valid = await comparePassword(data.password, user.hashedPassword);
    if (!valid) {
      throw new Error('Invalid credentials');
    }

    const token = generateJWT({ userId: user.UserId, role: user.role });
    return UserMapper.toResponse(user, token);
  }
}

export const authService = new AuthService();