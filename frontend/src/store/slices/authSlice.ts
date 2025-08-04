/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { User, AuthState, ApiResponse } from '../../types';
import api from '../../services/api';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false,
};

// Authetication checks and user initialization 
// 1️⃣ 被动检查
export const initializeAuth = createAsyncThunk(
  'auth/initialize', // action type (🔥 pending, fulfilled, rejected)
  async (_, { rejectWithValue }) => {
  // params: payload, 🌟 thunkAPI
    try {
      const response = await api.get<ApiResponse<User>>('/users/me');
      return response.data.data.doc; // Fetch the user data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to initialize');
    }
  }
);

/* ThunkAPI */
// {
//   dispatch,          // store.dispatch 函数
//   getState,          // store.getState 函数
//   rejectWithValue,   // 用于返回自定义错误
//   fulfillWithValue,  // 用于返回自定义成功值
//   requestId,         // 唯一请求ID
//   signal,            // AbortController.signal
//   extra              // 额外参数
// }

// 2️⃣ 主动登录
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<User>>('/users/login', { email, password });
      return response.data.data.doc; // login successful, return user data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// 3️⃣ 主动登出
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.get('/users/logout'); // Clear cookie on the backend
      return null; // logout successful, clear user data
    } catch (error: any) {
      // Even if backend logout fails, frontend should clear state
      return null;
    }
  }
);

// 🎯 Manage all authentication related actions
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // sync actions
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    // Handle all async actions
    builder
      // PENDING
      .addCase(initializeAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // FULFILLED
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // Set user data from backend
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      // REJECTED
      .addCase(initializeAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isInitialized = true;  // 🔑 Initialization complete even if failed
        state.error = action.payload as string;
      })
  },
});

export const { clearError, updateUser } = authSlice.actions;

export default authSlice.reducer;