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
    getTripPlanById: builder.query({
      query: (id: string) => ({
        url: `/trip-plans/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'TripPlan', id }],
    }),
    createTripPlan: builder.mutation({
      query: (data) => ({
        url: '/trip-plans',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['TripPlan'],
    }),
    updateTripPlan: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/trip-plans/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['TripPlan', { type: 'TripPlan', id }],
    }),
    deleteTripPlan: builder.mutation({
      query: (id: string) => ({
        url: `/trip-plans/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TripPlan'],
    }),
    addTripPlanItem: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/trip-plans/${id}/items`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['TripPlan', { type: 'TripPlan', id }],
    }),
    deleteTripPlanItem: builder.mutation({
      query: ({ planId, itemId }) => ({
        url: `/trip-plans/${planId}/items/${itemId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { planId }) => ['TripPlan', { type: 'TripPlan', id: planId }],
    }),
  }),
});

export const {
  useGetTripPlansQuery,
  useGetTripPlanByIdQuery,
  useCreateTripPlanMutation,
  useUpdateTripPlanMutation,
  useDeleteTripPlanMutation,
  useAddTripPlanItemMutation,
  useDeleteTripPlanItemMutation,
} = tripPlanApi;
