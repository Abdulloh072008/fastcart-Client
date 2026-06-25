import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/services/axiosBaseQuery'
import type {
  ApiResponse,
  GetProductsParams,
  PaginatedResponse,
  ProductDetail,
  ProductsData,
} from '@/types'

// Product controller (customer-facing reads only — add/update/delete/images are
// admin endpoints, out of scope per CLAUDE.md).
export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Products', 'Product'],
  endpoints: (builder) => ({
    // Returns the full paginated envelope: the catalog needs totalPage/
    // totalRecord for pagination and data.colors/brands/minMaxPrice for filters.
    getProducts: builder.query<
      PaginatedResponse<ProductsData>,
      GetProductsParams | void
    >({
      query: (params) => ({
        url: '/Product/get-products',
        method: 'GET',
        params: params ?? undefined,
      }),
      providesTags: ['Products'],
    }),
    getProductById: builder.query<ProductDetail, number>({
      query: (id) => ({
        url: '/Product/get-product-by-id',
        method: 'GET',
        params: { id },
      }),
      transformResponse: (res: ApiResponse<ProductDetail>) => res.data,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
  }),
})

export const { useGetProductsQuery, useGetProductByIdQuery } = productsApi
