import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'

import
{ Agregation, type AgregationsState } from '../types/redux'

export const rootAPISlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000'
  }),
  tagTypes: ['agregation'],
  endpoints: (builder) => ({
    getAgregations: builder.query<AgregationsState, void>({
        query: () => '/agregations/get',
        providesTags: (result) =>
          result?
            [
              ...result.agregations.map(({ id }) => ({ type: 'agregation' as const, id })),
              { type: 'agregation'},
            ]
            : [{ type: 'agregation'}],
        transformResponse: (responseData: Agregation[]) => {
          return {agregations: responseData}
        }
    }),
    getSingleAgregation: builder.query({
      query: postId => `/agregations/get/${postId}`,
      providesTags: (result, error, arg: string) => [{ type: 'agregation', id: arg }],
      transformResponse: (responseData: Agregation) => responseData
    }),
    addAgregation: builder.mutation({
      query: agregation => ({
        url: '/agregations/send',
        method: 'POST',
        body: agregation as object
      }),
      invalidatesTags: [{ type: 'agregation'}]
    }),
    patchAgregation: builder.mutation({
      query: (agregation: Agregation) => ({
        url: `/agregations/patch/${agregation.id}`,
        method: 'PATCH',
        body: agregation
      }),
      invalidatesTags: [{ type: 'agregation'}]
    }),
    deleteAgregation: builder.mutation({
      query: (agregation: Agregation) => ({
        url: `/agregations/delete/${agregation.id}`,
        method: 'DELETE',
        body: agregation
      }),
      invalidatesTags: [{ type: 'agregation'}]
    })
  })
})

export const {
  useGetAgregationsQuery,
  useGetSingleAgregationQuery,
  useAddAgregationMutation,
  usePatchAgregationMutation,
  useDeleteAgregationMutation,
} = rootAPISlice
