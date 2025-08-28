import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { mockAuthApi } from '../services/mockApi';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation({
      queryFn: async ({ email, password }: { email: string; password: string }) => {
        try {
          const result = await mockAuthApi.login(email, password);
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Auth'],
    }),
    
    logout: builder.mutation({
      queryFn: async () => {
        try {
          const result = await mockAuthApi.logout();
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Auth'],
    }),
    
    refreshToken: builder.mutation({
      queryFn: async () => {
        try {
          const result = await mockAuthApi.refreshToken();
          return { data: result };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Auth'],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
} = authApi;