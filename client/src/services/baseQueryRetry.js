import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setTokens, clearAll } from '../features/auth/authSlice'
import { Mutex } from 'async-mutex'

const mutex = new Mutex()

export const baseQuery = fetchBaseQuery ({ 
  // eslint-disable-next-line no-undef
  baseUrl: process.env.REACT_APP_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const accessToken = getState().auth.accessToken;
    if (accessToken) {
      headers.set(`authorization`, `Bearer ${accessToken}`)
    }
    return headers
  },
  timeout: 30000,   // 30s timeout
  keepUnusedDataFor: 30, // time to cache fetched data
})

export const baseQueryWithRedirect = async (args, api, extraOptions) => {
  await mutex.waitForUnlock() // wait until no lock
  let result = await baseQuery(args, api, extraOptions)
  if (result.error && result.error.status === 401) { // Unauthorized
    if (!mutex.isLocked()) {
      const release = await mutex.acquire() // acquire lock
      try {
        const refreshToken = api.getState().auth.refreshToken
        const id = api.getState().auth.user?.id
        if (refreshToken && id) {
          const refreshResult = await baseQuery({ 
            url: `auth/refresh`, method: 'POST', body: { userId: id, refreshToken }
          }, api, extraOptions)
          if (refreshResult.data) {
            api.dispatch(setTokens(refreshResult.data)) // store the new token
            result = await baseQuery(args, api, extraOptions)  // retry the initial query
          } else {
            api.dispatch(clearAll) // refresh failed, clear all auth data
          }
        }
      } finally {
        release() // release lock
      }
    } else {
      // locked! refresh just started in another thread
      await mutex.waitForUnlock() // wait for unlock
      result = await baseQuery(args, api, extraOptions) // retry the initial query
    }
  }
  return result

  // Hur undvika rundgång på anrop om 401 eller 403?
  // lägg till isNotAuthorized som svar?? =403 så att man dirigeras om i component?
  // hur skilja på ej loggat in och inte ha access (om inte inloggad = inget token?) bättre hantera i router? kaske hantera här också?

}
