import { baseApi } from '../../api/baseApi';

/**
 * A normal user only ever receives their own reservations; an admin receives all.
 * The server decides that from the token, so the client sends no userId.
 */
export const reservationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReservations: builder.query({
      query: (params) => ({
        url: '/reservations',
        method: 'GET',
        params,
      }),
      providesTags: ['Reservation'],
    }),
    createReservation: builder.mutation({
      query: (data) => ({
        url: '/reservations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Reservation'],
    }),
    updateReservationStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/reservations/${id}`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Reservation'],
    }),
    deleteReservation: builder.mutation({
      query: (id: string) => ({
        url: `/reservations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Reservation'],
    }),
  }),
});

export const {
  useGetReservationsQuery,
  useCreateReservationMutation,
  useUpdateReservationStatusMutation,
  useDeleteReservationMutation,
} = reservationApi;

