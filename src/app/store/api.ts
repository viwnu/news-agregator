import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'

import
{ Agregation, type AgregationsState } from '../types/redux'


export const rootAPISlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api'
  }),
  tagTypes: ['agregation'],
  endpoints: (builder) => ({
    getAgregations: builder.query<AgregationsState, void>({
        query: () => '/',
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
      query: agregationId => `/get-single-agregation/?id=${agregationId}`,
      providesTags: (result, error, arg: string) => [{ type: 'agregation', id: arg }],
      transformResponse: (responseData: Agregation) => responseData
    }),
    addAgregation: builder.mutation({
      query: agregation => ({
        url: '/',
        method: 'POST',
        body: agregation as object
      }),
      invalidatesTags: [{ type: 'agregation'}]
    }),
    patchAgregation: builder.mutation({
      query: (agregation: Agregation) => ({
        url: `/?id=${agregation.id}`,
        method: 'PATCH',
        body: agregation
      }),
      invalidatesTags: [{ type: 'agregation'}]
    }),
    deleteAgregation: builder.mutation({
      query: (agregation: Agregation) => ({
        url: `/?id=${agregation.id}`,
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
