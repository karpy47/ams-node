import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: sessionStorage.getItem('accessToken') || null,
    refreshToken: sessionStorage.getItem('refreshToken') || null,
    user: JSON.parse(sessionStorage.getItem('user')) || null,
    error: null,
  },
  reducers: {
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      sessionStorage.setItem('accessToken', action.payload.accessToken)
      sessionStorage.setItem('refreshToken', action.payload.refreshToken)
    },
    setUser: (state, action) => {
      state.user = action.payload
      sessionStorage.setItem('user', JSON.stringify(action.payload))
    },
    clearAll: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.user = null
      state.error = null
      sessionStorage.clear()
    },
  },
});

export default authSlice.reducer
export const { setTokens, setUser, clearAll } = authSlice.actions
