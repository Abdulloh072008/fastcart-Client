import type { BaseQueryFn } from '@reduxjs/toolkit/query'
import type { AxiosError, AxiosRequestConfig } from 'axios'
import { axiosInstance } from '@/lib/axios'

export interface AxiosBaseQueryArgs {
  url: string
  method?: AxiosRequestConfig['method']
  data?: AxiosRequestConfig['data']
  params?: AxiosRequestConfig['params']
  headers?: AxiosRequestConfig['headers']
}

export interface AxiosBaseQueryError {
  status?: number
  data: unknown
}

/**
 * Custom RTK Query base query that routes every request through the shared
 * Axios instance (so the auth + 401 interceptors apply to all server calls).
 * Used in place of fetchBaseQuery — see CLAUDE.md / TZ §5.
 */
export const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method = 'GET', data, params, headers }) => {
    try {
      const result = await axiosInstance({ url, method, data, params, headers })
      return { data: result.data }
    } catch (axiosError) {
      const err = axiosError as AxiosError
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data ?? err.message,
        },
      }
    }
  }
