import { baseApi } from '../../api/baseApi';

/** Trip plans are always scoped to the logged-in user by the server. */
export const tripPlanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTripPlans: builder.query({
      query: () => ({
        url: '/trip-plans',
        method: 'GET',
      }),
      providesTags: ['TripPlan'],
    }),
    createTripPlan: builder.mutation({
      query: (data) => ({
        url: '/trip-plans',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TripPlan'],
    }),
  }),
});

export const { useGetTripPlansQuery, useCreateTripPlanMutation } = tripPlanApi;
