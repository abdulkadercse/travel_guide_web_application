import { baseApi } from '../../api/baseApi';

/** Admin-only aggregate counters for the dashboard overview. */
export const statsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query({
      query: () => ({
        url: '/stats/overview',
        method: 'GET',
      }),
      providesTags: ['Stats'],
    }),
  }),
});

export const { useGetAdminOverviewQuery } = statsApi;
