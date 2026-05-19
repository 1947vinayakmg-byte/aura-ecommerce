import { User } from '../types';

/**
 * Service for managing user profiles and preferences.
 */
export const userService = {
  /**
   * Updates user profile information.
   */
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      id: userId,
      name: data.name || 'Valmont V.',
      email: data.email || 'valmont@aura-elite.com',
      role: 'user'
    };
  },

  /**
   * Fetches user preferences and settings.
   */
  getPreferences: async (userId: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      notifications: true,
      tier: 'platinum',
      newsletter: true
    };
  }
};
