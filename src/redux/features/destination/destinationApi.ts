import { baseApi } from '../../api/baseApi';

export const destinationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDestinations: builder.query({
      query: (params) => ({
        url: '/destinations',
        method: 'GET',
        params,
      }),
      providesTags: ['Destination'],
    }),
    getDestinationById: builder.query({
      query: (id: string) => ({
        url: `/destinations/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Destination', id }],
    }),
    createDestination: builder.mutation({
      query: (data) => ({
        url: '/destinations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Destination'],
    }),
    updateDestination: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/destinations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Destination', { type: 'Destination', id }],
    }),
    deleteDestination: builder.mutation({
      query: (id: string) => ({
        url: `/destinations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Destination'],
    }),
  }),
});

export const {
  useGetDestinationsQuery,
  useGetDestinationByIdQuery,
  useCreateDestinationMutation,
  useUpdateDestinationMutation,
  useDeleteDestinationMutation,
} = destinationApi;
