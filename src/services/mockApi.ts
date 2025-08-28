// Create: src/services/mockApi.ts

import { dummyAuthState, dummyNotifications, dummyGrades } from '../data/dummyData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthApi = {
  login: async (email: string, password: string) => {
    await delay(1000); // Simulate network delay
    
    // Simple validation - accept any email/password for demo
    if (email && password) {
      return {
        success: true,
        data: dummyAuthState
      };
    } else {
      return {
        success: false,
        error: 'Invalid credentials'
      };
    }
  },

  logout: async () => {
    await delay(500);
    return { success: true };
  },

  refreshToken: async () => {
    await delay(500);
    return {
      success: true,
      data: { token: 'new-dummy-token-67890' }
    };
  }
};

export const mockDataApi = {
  getNotifications: async () => {
    await delay(800);
    return {
      success: true,
      data: dummyNotifications
    };
  },

  getGrades: async () => {
    await delay(1000);
    return {
      success: true,
      data: dummyGrades
    };
  },

  getUserProfile: async () => {
    await delay(600);
    return {
      success: true,
      data: dummyAuthState.user
    };
  }
};