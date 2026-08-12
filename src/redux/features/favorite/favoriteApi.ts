import { baseApi } from '../../api/baseApi';

/**
 * Every favorite endpoint is scoped to the logged-in user by the server,
 * so no userId is ever sent from the client.
 */
export const favoriteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFavorites: builder.query({
      query: () => ({
        url: '/favorites',
        method: 'GET',
      }),
      providesTags: ['Favorite'],
    }),
    checkFavorite: builder.query({
      query: (destinationId: string) => ({
        url: `/favorites/check/${destinationId}`,
        method: 'GET',
      }),
      providesTags: (result, error, destinationId) => [{ type: 'Favorite', id: destinationId }],
    }),
    addFavorite: builder.mutation({
      query: (destinationId: string) => ({
        url: '/favorites',
        method: 'POST',
        body: { destinationId },
      }),
      invalidatesTags: ['Favorite'],
    }),
    removeFavorite: builder.mutation({
      query: (destinationId: string) => ({
        url: `/favorites/${destinationId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Favorite'],
    }),
  }),
});

export const {
  useGetFavoritesQuery,
  useCheckFavoriteQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoriteApi;
