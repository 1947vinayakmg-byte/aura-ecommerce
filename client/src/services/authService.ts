import { User } from '../types';

/**
 * Service for handling user authentication and session management.
 */
export const authService = {
  /**
   * Simulates a user login.
   */
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock validation
    if (password.length < 6) {
      throw new Error('Authentication failed: Invalid credentials.');
    }

    const mockUser: User = {
      id: 'usr-001',
      name: 'Valmont V.',
      email,
      role: email.includes('admin') ? 'admin' : 'user'
    };

    return { user: mockUser, token: 'jwt_mock_token_aura' };
  },

  /**
   * Simulates user registration.
   */
  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockUser: User = {
      id: `usr-${Math.floor(Math.random() * 1000)}`,
      name,
      email,
      role: 'user'
    };

    return { user: mockUser, token: 'jwt_mock_token_aura_new' };
  },

  /**
   * Simulates session validation.
   */
  validateSession: async (token: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      id: 'usr-001',
      name: 'Valmont V.',
      email: 'valmont@aura-elite.com',
      role: 'user'
    };
  }
};
