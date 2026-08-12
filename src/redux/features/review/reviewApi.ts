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
      invalidatesTags: ['Review', 'Destination', 'Hotel'],
    }),
  }),
});

export const { useGetReviewsQuery, useCreateReviewMutation } = reviewApi;
