import { configureStore } from '@reduxjs/toolkit'
import { apiClient } from './services/apiClient'
import authReducer from './features/auth/authSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiClient.reducerPath]: apiClient.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiClient.middleware),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// setupListeners(store.dispatch)

export default store
