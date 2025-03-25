import { api, ApiResponse } from './api';
import { User } from '@/lib/auth';

/**
 * Interface for user login data
 */
export interface LoginData {
  username: string;
  password: string;
}

/**
 * Interface for user data returned from the server
 */
export interface UserAuthResponse {
  user: User;
  token: string;
}

/**
 * Authentication service methods
 */
export const authService = {
  /**
   * Login user
   * @param loginData - Username and password
   * @returns Promise with user data including token
   */
  login: async (loginData: LoginData): Promise<ApiResponse<UserAuthResponse>> => {
    // For login, we don't use authentication (no token yet)
    const response = await api.post<UserAuthResponse>('auth/login', loginData, { useAuth: false });
    
    if (response.success && response.data) {
      // Store token and user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  /**
   * Check if user is logged in
   * @returns boolean
   */
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get current user data
   * @returns User data from localStorage
   */
  getCurrentUser: (): User | null => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  /**
   * Logout user
   */
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};