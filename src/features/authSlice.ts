// src/features/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../models/models';

const initialState: AuthState = {
  user: null,
  token: null,
  message: null,
  password_reset_token: null,
  reset_message: null,
  roles: [],
  grades: [],
  users: [],
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{
      token: string;
      user: User;
      message: string;
    }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.message = null;
      state.password_reset_token = null;
      state.reset_message = null;
      state.isAuthenticated = false;
      // Clear localStorage
      localStorage.removeItem('auth');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setRoles: (state, action: PayloadAction<AuthState['roles']>) => {
      state.roles = action.payload;
    },
    // Alias for compatibility with existing code
    setRoleList: (state, action: PayloadAction<AuthState['roles']>) => {
      state.roles = action.payload;
    },
    setGrades: (state, action: PayloadAction<AuthState['grades']>) => {
      state.grades = action.payload;
    },
    setPasswordResetToken: (state, action: PayloadAction<string>) => {
      state.password_reset_token = action.payload;
    },
    clearPasswordReset: (state) => {
      state.password_reset_token = null;
      state.reset_message = null;
    }
  },
});

export const { 
  setCredentials, 
  logout, 
  updateUser, 
  setRoles, 
  setRoleList, // Added for compatibility
  setGrades, 
  setPasswordResetToken, 
  clearPasswordReset 
} = authSlice.actions;

export default authSlice.reducer;