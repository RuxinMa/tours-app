/* eslint-disable @typescript-eslint/no-explicit-any */
import api from './api';
import type { User } from '../types';
import { transformSingle } from './utils/apiTransformers';
import type { SingleDocResponse } from './utils/apiTransformers';

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
      const response = await api.post<SingleDocResponse<User>>('/users/login', { 
        email, 
        password 
      });
    
      return transformSingle(response.data);
    } catch (error) {
      console.error('🔐 AuthService: Login failed for:', email);
      throw error; // Re-throw to let calling code handle
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
      const response = await api.post<SingleDocResponse<User>>('/users/signup', userData);
      return transformSingle(response.data);
    } catch (error: any) {
      console.error('🔐 AuthService: Registration failed for:', userData.email);
      
      // Handle specific registration errors
      if (error.response?.data?.error?.code === 11000) {
        throw new Error('Email already exists. Please use a different email.');
      }
      
      // Re-throw other errors
      throw error;
    }
  },

  /**
   * Update user profile (bonus feature for later)
   */
  async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.patch<SingleDocResponse<User>>('/users/updateMe', userData);
      return transformSingle(response.data);
    } catch (error) {
      console.error('🔐 AuthService: Profile update failed');
      throw error;
    }
  },
};