import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authReducer from '@/features/auth/authSlice'
import wishlistReducer from '@/features/wishlist/wishlistSlice'
import ordersReducer from '@/features/orders/ordersSlice'
import { accountApi } from '@/services/accountApi'
import { productsApi } from '@/services/productsApi'
import { catalogApi } from '@/services/catalogApi'
import { cartApi } from '@/services/cartApi'
import { profileApi } from '@/services/profileApi'

// One RTK Query API slice per backend controller, each built on the shared
// axiosBaseQuery (so the Axios auth + 401 interceptors apply to every call).
const apis = [accountApi, productsApi, catalogApi, cartApi, profileApi]

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
    orders: ordersReducer,
    [accountApi.reducerPath]: accountApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apis.map((api) => api.middleware)),
})

// Enables refetchOnFocus / refetchOnReconnect behaviors.
setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
