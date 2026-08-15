import { baseApi } from '../../api/baseApi';

export const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query({
      query: (params) => ({
        url: '/reviews',
        method: 'GET',
        params,
      }),
      providesTags: ['Review'],
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: '/reviews',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Review', 'Destination', 'Hotel', 'Restaurant'],
    }),
    updateReview: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/reviews/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Review', 'Destination', 'Hotel', 'Restaurant'],
    }),
    deleteReview: builder.mutation({
      query: (id: string) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review', 'Destination', 'Hotel', 'Restaurant'],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
