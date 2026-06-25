import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/services/axiosBaseQuery'
import type { ApiResponse, LoginDto, RegisterDto } from '@/types'

// Account controller. login returns the JWT token string; register returns a
// confirmation message string.
export const accountApi = createApi({
  reducerPath: 'accountApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation<string, LoginDto>({
      query: (body) => ({ url: '/Account/login', method: 'POST', data: body }),
      transformResponse: (res: ApiResponse<string>) => res.data,
    }),
    register: builder.mutation<string, RegisterDto>({
      query: (body) => ({
        url: '/Account/register',
        method: 'POST',
        data: body,
      }),
      transformResponse: (res: ApiResponse<string>) => res.data,
    }),
  }),
})

export const { useLoginMutation, useRegisterMutation } = accountApi
