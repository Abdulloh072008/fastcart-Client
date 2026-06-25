import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/services/axiosBaseQuery'
import type { ApiResponse, UpdateProfilePayload, UserProfile } from '@/types'

// UserProfile controller (customer scope: read own profile by id + update it).
// update-user-profile is multipart/form-data, so we build a FormData body.
export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfileById: builder.query<UserProfile, string>({
      query: (id) => ({
        url: '/UserProfile/get-user-profile-by-id',
        method: 'GET',
        params: { id },
      }),
      transformResponse: (res: ApiResponse<UserProfile>) => res.data,
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<string, UpdateProfilePayload>({
      query: (payload) => {
        const formData = new FormData()
        formData.append('FirstName', payload.FirstName)
        formData.append('LastName', payload.LastName)
        formData.append('Email', payload.Email)
        formData.append('PhoneNumber', payload.PhoneNumber)
        formData.append('Dob', payload.Dob)
        if (payload.Image) formData.append('Image', payload.Image)
        return {
          url: '/UserProfile/update-user-profile',
          method: 'PUT',
          data: formData,
        }
      },
      transformResponse: (res: ApiResponse<string>) => res.data,
      invalidatesTags: ['Profile'],
    }),
  }),
})

export const { useGetProfileByIdQuery, useUpdateProfileMutation } = profileApi
