import { createApi } from '@reduxjs/toolkit/query/react'
import { clearAll, setTokens, setUser } from '../features/auth/authSlice'
import { baseQueryWithRedirect  } from './baseQueryRetry'

// Helper function for setting cache tags for lists
function providesList(resultsWithIds, tagType) {
  return resultsWithIds
    ? [
        { type: tagType, id: 'LIST' },
        ...resultsWithIds.map(({ id }) => ({ type: tagType, id })),
      ]
    : [
        { type: tagType, id: 'LIST' }
      ]
}

// Define a service using a base URL and api endpoints
export const apiClient = createApi({
  reducerPath: 'apiClient',
  baseQuery: baseQueryWithRedirect,
  endpoints: (builder) => ({

    // *** auth ***
    authLogin: builder.mutation({ 
      query: (body) => ({ url: `auth/login`, method: 'POST', body }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setTokens(data))
          dispatch(setUser(data.user))
        } catch (err) {
          dispatch(clearAll())  // clear all on error
        }
      }
    }),
    authRefresh: builder.mutation({ 
      query: (body) => ({ url: `auth/refresh`, method: 'POST', body }),
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setTokens(data))
        } catch (err) {
          dispatch(clearAll())  // clear all on error
        }
      }
    }),
    authUser: builder.query({ 
      query: () => `auth/user`,
      async onQueryStarted({ dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(setUser(data))
        } catch (err) {
          dispatch(clearAll())  // clear all on error
        }
      }
    }),
    authLogout: builder.query({ 
      query: () => `auth/logout`,
      async onQueryStarted({ dispatch }) {
        dispatch(clearAll())  // clear all directly on logout
      },
    }),

    // *** users ***
    getUsers: builder.query({ 
      query: () => `users`,
      providesTags: (result) => providesList(result, 'users'),
    }),
    getUser: builder.query({ 
      query: (id) => `users/${id}`,
      providesTags: (result, error, id) => [{ type: 'users', id }],
    }),
    addUser: builder.mutation({
      query: (body) => ({ url: `users`, method: 'POST', body }),
      invalidatesTags: [{ type: 'users', id: 'LIST' }],
    }),
    updateUser: builder.mutation({ 
      query: ({ id, ...body }) => ({ url: `users/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'users', id }],
    }),
    deleteUse: builder.mutation({ 
      query: (id) => ({ url: `users/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'users', id }],
    }),

    // *** user-groups ***
    getUserGroups: builder.query({ 
      query: () => `user-groups`,
      providesTags: (result) => providesList(result, 'user-groups'),
    }),
    getUserGroup: builder.query({ 
      query: (id) => `user-groups/${id}`,
      providesTags: (result, error, id) => [{ type: 'user-groups', id }],
    }),
    addUserGroup: builder.mutation({
      query: (body) => ({ url: `user-groups`, method: 'POST', body }),
      invalidatesTags: [{ type: 'user-groups', id: 'LIST' }],
    }),
    updateUserGroup: builder.mutation({ 
      query: ({ id, ...body }) => ({ url: `user-groups/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'user-groups', id }],
    }),
    deleteUserGroup: builder.mutation({ 
      query: (id) => ({ url: `user-groups/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { id }) => [{ type: 'user-groups', id }]
    }),

  }),
})

export const { 
  useAuthLoginMutation, useAuthRefreshMutation, useAuthUserQuery, useAuthLogoutQuery,
  useGetUsersQuery, useGetUserQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation,
  useGetUserGroupsQuery, useGetUserGroupQuery, useAddUserGroupMutation, useUpdateUserGroupMutation, useDeleteUserGroupMutation,

} = apiClient
