import { createSlice, current, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

const STORAGE_KEY = 'fastcart_wishlist'

function load(): number[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { ids: load() },
  reducers: {
    toggleWishlist(state, action: PayloadAction<number>) {
      const idx = state.ids.indexOf(action.payload)
      if (idx >= 0) state.ids.splice(idx, 1)
      else state.ids.push(action.payload)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current(state.ids)))
    },
    removeFromWishlist(state, action: PayloadAction<number>) {
      state.ids = state.ids.filter((id) => id !== action.payload)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current(state.ids)))
    },
    clearWishlist(state) {
      state.ids = []
      localStorage.setItem(STORAGE_KEY, '[]')
    },
  },
})

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export const selectWishlistCount = (state: RootState) => state.wishlist.ids.length
export const selectIsWishlisted = (id: number) => (state: RootState) =>
  state.wishlist.ids.includes(id)
export default wishlistSlice.reducer
