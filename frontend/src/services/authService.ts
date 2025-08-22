/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import type { User } from '../types';
import { transformSingle } from './utils/apiTransformers';
import type { SingleDocResponse } from './utils/apiTransformers';
import { transformErrorMessage } from './utils/errorHandler';

// 🔐 Transform authentication response to User type
const transformAuthResponse = (authResponse: any): User => {
  const userData = authResponse.data.user;
  
  return {
    id: userData._id || userData.id,
    name: userData.name,
    email: userData.email,
    photo: userData.photo,
    role: userData.role
  };
};

// AuthService - handles API calls related to authentication
export const authService = {
  /**
   * Check current authentication status
   * Used for initializing auth state on app startup
   */
  async checkAuthStatus(): Promise<User> {
    try {
      const response = await api.get<SingleDocResponse<User>>('/users/me');
      return transformSingle(response.data);
    } catch (error) {
      console.warn('🔐 AuthService: No authenticated user found');
      throw error; // Let the calling code handle the error
    }
  },

  /**
   * Login user with email and password
   */
  async login(email: string, password: string): Promise<User> {
    try {
      const response = await api.post('/users/login', { email, password });
      return transformAuthResponse(response.data);
    } catch (error: any) {

      if (error instanceof Error && error.message) {
        throw new Error(transformErrorMessage(error.message));
      }
      
      if (error.response?.data?.message) {
        throw new Error(transformErrorMessage(error.response.data.message));
      }
      
      throw new Error('Login failed. Please try again.');
    }
  },

  // Logout current user
  async logout(): Promise<void> {
    try {
      await api.get('/users/logout');
    } catch {
      console.warn('🔐 AuthService: Logout API call failed, but continuing...');
      // Don't throw error for logout - we want to clear frontend state regardless
    }
  },

  /**
   * Register new user
   */
  async register(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    try {
      const requestData = {
        ...userData,
        passwordConfirm: userData.password
      };
      
      const response = await api.post('/users/signup', requestData);
      return transformAuthResponse(response.data);
    } catch (error: any) {

      if (error instanceof Error && error.message) {
        throw new Error(transformErrorMessage(error.message));
      }
      
      if (error.response?.data?.message) {
        throw new Error(transformErrorMessage(error.response.data.message));
      }
      
      throw new Error('Registration failed. Please try again.');
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userData: Partial<User> | FormData): Promise<User> {
    try {
      console.log('🔐 AuthService: Updating profile...', userData);
      
      const response = await api.patch('/users/updateMe', userData);
      const updatedUser = response.data.data.user ;
      
      console.log('🔐 AuthService: Profile updated successfully:', updatedUser);
      return updatedUser;
    } catch (error) {
      console.error('🔐 AuthService: Profile update failed');
      throw error;
    }
  },
};