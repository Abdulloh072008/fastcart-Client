import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getToken, removeToken, setToken } from '@/utils/token'

export interface AuthState {
  token: string | null
}

const initialState: AuthState = {
  // Rehydrate from localStorage so the session survives a reload.
  token: getToken(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token
      setToken(action.payload.token)
    },
    logout(state) {
      state.token = null
      removeToken()
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
