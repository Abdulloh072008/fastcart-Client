import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/services/axiosBaseQuery'
import type {
  ApiResponse,
  Brand,
  Category,
  Color,
  GetBrandsParams,
  GetColorsParams,
  PaginatedResponse,
  SubCategory,
} from '@/types'

// One slice for the four catalog controllers used to build filters/menus:
// Category, SubCategory, Brand, Color. Brands/colors are paginated; we unwrap
// to the array (callers pass a large PageSize when they need the full set).
export const catalogApi = createApi({
  reducerPath: 'catalogApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => ({ url: '/Category/get-categories', method: 'GET' }),
      transformResponse: (res: ApiResponse<Category[]>) => res.data,
    }),
    getSubCategories: builder.query<SubCategory[], void>({
      query: () => ({ url: '/SubCategory/get-sub-category', method: 'GET' }),
      transformResponse: (res: ApiResponse<SubCategory[]>) => res.data,
    }),
    getBrands: builder.query<Brand[], GetBrandsParams | void>({
      query: (params) => ({
        url: '/Brand/get-brands',
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (res: PaginatedResponse<Brand[]>) => res.data,
    }),
    getColors: builder.query<Color[], GetColorsParams | void>({
      query: (params) => ({
        url: '/Color/get-colors',
        method: 'GET',
        params: params ?? undefined,
      }),
      transformResponse: (res: PaginatedResponse<Color[]>) => res.data,
    }),
  }),
})

export const {
  useGetCategoriesQuery,
  useGetSubCategoriesQuery,
  useGetBrandsQuery,
  useGetColorsQuery,
} = catalogApi
