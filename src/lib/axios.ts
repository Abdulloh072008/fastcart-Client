import axios from 'axios'
import { getToken, removeToken } from '@/utils/token'
import { navigateToLogin } from '@/lib/navigation'

export const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
})

// Request interceptor: attach Bearer token to every call.
axiosInstance.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: on 401, log the user out and redirect to login.
// The auth slice mirrors the token to localStorage, so clearing it here drops
// the session; navigateToLogin does a client-side React Router transition
// (preserving the attempted location) instead of a full page reload.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      navigateToLogin()
    }
    return Promise.reject(error)
  },
)
