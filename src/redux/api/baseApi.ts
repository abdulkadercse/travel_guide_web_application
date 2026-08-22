import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export const baseApi = createApi({
  reducerPath: 'baseApi',
  keepUnusedDataFor: 300, // Cache data for 5 minutes by default
  refetchOnFocus: false,
  refetchOnReconnect: true,
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
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

  tagTypes: [
    'Auth',
    'User',
    'Destination',
    'Hotel',
    'Restaurant',
    'Transportation',
    'Review',
    'Favorite',
    'TripPlan',
    'Reservation',
    'Stats',
  ],
  endpoints: () => ({}),
});
