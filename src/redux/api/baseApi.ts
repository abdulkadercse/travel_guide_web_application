import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

/**
 * All data flows through the Express Application Server Layer (SRS 7.2).
 * The frontend never talks to the database directly.
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5001/api/v1';

export const baseApi = createApi({
  reducerPath: 'baseApi',
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
    'Transportation',
    'Review',
    'Favorite',
    'TripPlan',
    'Reservation',
  ],
  endpoints: () => ({}),
});
