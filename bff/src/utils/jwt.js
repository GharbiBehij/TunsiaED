import jwt from 'jsonwebtoken';

export const generateJWT = (payload) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret is not configured');
  }
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};