// src/services/AuthService.js
const BFF_BASE_URL = process.env.REACT_APP_BFF_URL || 'http://localhost:3002';

class AuthService {
  async login(credentials) {
    try {
      if (!credentials.email || !credentials.password) {
        return {
          status: 'error',
          message: 'Invalid inputs',
          retryable: true,
        };
      }

      const response = await fetch(`${BFF_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.status === 200) {
        const data = await response.json();
        return {
          status: 'success',
          data,
        };
      }
      const error = await response.json();
      return {
        status: 'error',
        message: error.error || 'Login failed',
        retryable: true,
      };
    } catch (exception) {
      console.error('AuthService.login Failed', exception);
      return {
        status: 'error',
        message: 'Connection failed',
        retryable: true,
      };
    }
  }

  async signup(credentials) {
    try {
      if (!credentials.email || !credentials.password || !credentials.name) {
        return {
          status: 'error',
          message: 'Invalid inputs',
          retryable: true,
        };
      }

      const response = await fetch(`${BFF_BASE_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (response.status === 201 || response.status === 200) {
        const data = await response.json();
        return {
          status: 'success',
          data,
        };
      }
      const error = await response.json();
      return {
        status: 'error',
        message: error.error || 'Signup failed',
        retryable: true,
      };
    } catch (exception) {
      console.error('AuthService.signup Failed', exception);
      return {
        status: 'error',
        message: 'Connection failed',
        retryable: true,
      };
    }
  }
}

export const authService = new AuthService();

