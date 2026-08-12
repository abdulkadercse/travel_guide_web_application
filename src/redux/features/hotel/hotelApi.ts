import { baseApi } from '../../api/baseApi';

export const hotelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHotels: builder.query({
      query: (params) => ({
        url: '/hotels',
        method: 'GET',
        params,
      }),
      providesTags: ['Hotel'],
    }),
    getHotelById: builder.query({
      query: (id: string) => ({
        url: `/hotels/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Hotel', id }],
    }),
    createHotel: builder.mutation({
      query: (data) => ({
        url: '/hotels',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Hotel'],
    }),
    updateHotel: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/hotels/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Hotel', { type: 'Hotel', id }],
    }),
    deleteHotel: builder.mutation({
      query: (id: string) => ({
        url: `/hotels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Hotel'],
    }),
  }),
});

export const {
  useGetHotelsQuery,
  useGetHotelByIdQuery,
  useCreateHotelMutation,
  useUpdateHotelMutation,
  useDeleteHotelMutation,
} = hotelApi;
