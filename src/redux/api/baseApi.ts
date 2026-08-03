import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth?: { token: string | null } };
      const token =
        state?.auth?.token ||
        (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Auth'],
  endpoints: () => ({}),
});
