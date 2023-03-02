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
      async onQueryStarted(body, { dispatch, queryFulfilled }) {
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

    // *** patients ***
    getPatients: builder.query({ 
      query: () => `patients`,
      providesTags: (result) => providesList(result, 'patients'),
    }),
    getPatient: builder.query({ 
      query: (id) => `patients/${id}`,
      providesTags: (result, error, id) => [{ type: 'patients', id }],
    }),
    addPatient: builder.mutation({
      query: (body) => ({ url: `patients`, method: 'POST', body }),
      invalidatesTags: [{ type: 'patients', id: 'LIST' }],
    }),
    updatePatient: builder.mutation({ 
      query: ({ id, ...body }) => ({ url: `patients/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'patients', id }],
    }),
    deletePatient: builder.mutation({ 
      query: (id) => ({ url: `patients/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { id }) => [{ type: 'patients', id }]
    }),

    // *** clinics ***
    getClinics: builder.query({ 
      query: () => `clinics`,
      providesTags: (result) => providesList(result, 'clinics'),
    }),
    getClinic: builder.query({ 
      query: (id) => `clinics/${id}`,
      providesTags: (result, error, id) => [{ type: 'clinics', id }],
    }),
    addClinic: builder.mutation({
      query: (body) => ({ url: `clinics`, method: 'POST', body }),
      invalidatesTags: [{ type: 'clinics', id: 'LIST' }],
    }),
    updateClinic: builder.mutation({ 
      query: ({ id, ...body }) => ({ url: `clinics/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'clinics', id }],
    }),
    deleteClinic: builder.mutation({ 
      query: (id) => ({ url: `clinics/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { id }) => [{ type: 'clinics', id }]
    }),

    // *** devices ***
    getDevices: builder.query({ 
      query: () => `devices`,
      providesTags: (result) => providesList(result, 'devices'),
    }),
    getDevice: builder.query({ 
      query: (id) => `devices/${id}`,
      providesTags: (result, error, id) => [{ type: 'devices', id }],
    }),
    addDevice: builder.mutation({
      query: (body) => ({ url: `devices`, method: 'POST', body }),
      invalidatesTags: [{ type: 'devices', id: 'LIST' }],
    }),
    updateDevice: builder.mutation({ 
      query: ({ id, ...body }) => ({ url: `devices/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'devices', id }],
    }),
    deleteDevice: builder.mutation({ 
      query: (id) => ({ url: `devices/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { id }) => [{ type: 'devices', id }]
    }),

    // *** components ***
    getComponents: builder.query({ 
      query: () => `components`,
      providesTags: (result) => providesList(result, 'components'),
    }),
    getComponent: builder.query({ 
      query: (id) => `components/${id}`,
      providesTags: (result, error, id) => [{ type: 'components', id }],
    }),
    addComponent: builder.mutation({
      query: (body) => ({ url: `components`, method: 'POST', body }),
      invalidatesTags: [{ type: 'components', id: 'LIST' }],
    }),
    updateComponent: builder.mutation({ 
      query: ({ id, ...body }) => ({ url: `components/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'components', id }],
    }),
    deleteComponent: builder.mutation({ 
      query: (id) => ({ url: `components/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { id }) => [{ type: 'components', id }]
    }),

    // *** device-events ***
    getDeviceEvents: builder.query({ 
      query: () => `device-events`,
      providesTags: (result) => providesList(result, 'device-events'),
    }),
    getDeviceEvent: builder.query({ 
      query: (id) => `device-events/${id}`,
      providesTags: (result, error, id) => [{ type: 'device-events', id }],
    }),
    addDeviceEvent: builder.mutation({
      query: (body) => ({ url: `device-events`, method: 'POST', body }),
      invalidatesTags: [{ type: 'device-events', id: 'LIST' }],
    }),
    updateDeviceEvent: builder.mutation({ 
      query: ({ id, ...body }) => ({ url: `device-events/${id}`, method: 'PUT', body }),
      invalidatesTags: (result, error, { id }) => [{ type: 'device-events', id }],
    }),
    deleteDeviceEvent: builder.mutation({ 
      query: (id) => ({ url: `device-events/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, { id }) => [{ type: 'device-events', id }]
    }),

    // *** audit-log ***
    getAuditLogs: builder.query({ 
      query: () => `audit-log`,
      providesTags: (result) => providesList(result, 'audit-log'),
    }),
    getAuditLog: builder.query({ 
      query: (id) => `audit-log/${id}`,
      providesTags: (result, error, id) => [{ type: 'audit-log', id }],
    }),

    // *** event-log ***
    getEventLogs: builder.query({ 
      query: () => `event-log`,
      providesTags: (result) => providesList(result, 'event-log'),
    }),
    getEventLog: builder.query({ 
      query: (id) => `event-log/${id}`,
      providesTags: (result, error, id) => [{ type: 'event-log', id }],
    }),

  }),
})

export const { 
  useAuthLoginMutation, useAuthRefreshMutation, useAuthUserQuery, useAuthLogoutQuery,
  useGetUsersQuery, useGetUserQuery, useAddUserMutation, useUpdateUserMutation, useDeleteUserMutation,
  useGetUserGroupsQuery, useGetUserGroupQuery, useAddUserGroupMutation, useUpdateUserGroupMutation, useDeleteUserGroupMutation,
  useGetPatientsQuery, useGetPatientQuery, useAddPatientMutation, useUpdatePatientMutation, useDeletePatientMutation,
  useGetClinicsQuery, useGetClinicQuery, useAddClinicMutation, useUpdateClinicMutation, useDeleteClinicMutation,
  useGetDevicesQuery, useGetDeviceQuery, useAddDeviceMutation, useUpdateDeviceMutation, useDeleteDeviceMutation,
  useGetComponentsQuery, useGetComponentQuery, useAddComponentMutation, useUpdateComponentMutation, useDeleteComponentMutation,
  useGetDeviceEventsQuery, useGetDeviceEventQuery, useAddDeviceEventMutation, useUpdateDeviceEventMutation, useDeleteDeviceEventMutation,
  useGetAuditLogsQuery, useGetAuditLogQuery, 
  useGetEventLogsQuery, useGetEventLogQuery, 

} = apiClient
