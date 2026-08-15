import { baseApi } from '../../api/baseApi';

export const restaurantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRestaurants: builder.query({
      query: (params) => ({
        url: '/restaurants',
        method: 'GET',
        params,
      }),
      providesTags: ['Restaurant'],
    }),
    getRestaurantById: builder.query({
      query: (id: string) => ({
        url: `/restaurants/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Restaurant', id }],
    }),
    createRestaurant: builder.mutation({
      query: (data) => ({
        url: '/restaurants',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Restaurant'],
    }),
    updateRestaurant: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/restaurants/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => ['Restaurant', { type: 'Restaurant', id }],
    }),
    deleteRestaurant: builder.mutation({
      query: (id: string) => ({
        url: `/restaurants/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Restaurant'],
    }),
  }),
});

export const {
  useGetRestaurantsQuery,
  useGetRestaurantByIdQuery,
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
  useDeleteRestaurantMutation,
} = restaurantApi;
