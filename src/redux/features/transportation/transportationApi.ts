import { baseApi } from '../../api/baseApi';

export const transportationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransportations: builder.query({
      query: (params) => ({
        url: '/transportations',
        method: 'GET',
        params,
      }),
      providesTags: ['Transportation'],
    }),
    getTransportationById: builder.query({
      query: (id: string) => ({
        url: `/transportations/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Transportation', id }],
    }),
    createTransportation: builder.mutation({
      query: (data) => ({
        url: '/transportations',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transportation'],
    }),
    updateTransportation: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/transportations/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Transportation'],
    }),
    deleteTransportation: builder.mutation({
      query: (id: string) => ({
        url: `/transportations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Transportation'],
    }),
  }),
});

export const {
  useGetTransportationsQuery,
  useGetTransportationByIdQuery,
  useCreateTransportationMutation,
  useUpdateTransportationMutation,
  useDeleteTransportationMutation,
} = transportationApi;
