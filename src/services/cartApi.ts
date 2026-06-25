import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from '@/services/axiosBaseQuery'
import type { ApiResponse, Cart } from '@/types'

const EMPTY_CART: Cart = {
  productsInCart: [],
  totalProducts: 0,
  totalPrice: 0,
  totalDiscountPrice: 0,
}

// Cart controller. get-products-from-cart returns `data: Cart[]` (one element);
// we unwrap to that single Cart. Every mutation invalidates the cached cart so
// the badge + cart page refetch. NOTE id semantics:
//   add    -> product id
//   increase/reduce/delete -> cart-line id (CartItem.id)
//   clear  -> no id
export const cartApi = createApi({
  reducerPath: 'cartApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    getCart: builder.query<Cart, void>({
      query: () => ({
        url: '/Cart/get-products-from-cart',
        method: 'GET',
      }),
      transformResponse: (res: ApiResponse<Cart[]>) => res.data[0] ?? EMPTY_CART,
      providesTags: ['Cart'],
    }),
    addToCart: builder.mutation<string, number>({
      query: (productId) => ({
        url: '/Cart/add-product-to-cart',
        method: 'POST',
        params: { id: productId },
      }),
      transformResponse: (res: ApiResponse<string>) => res.data,
      invalidatesTags: ['Cart'],
    }),
    increaseInCart: builder.mutation<string, number>({
      query: (cartItemId) => ({
        url: '/Cart/increase-product-in-cart',
        method: 'PUT',
        params: { id: cartItemId },
      }),
      transformResponse: (res: ApiResponse<string>) => res.data,
      invalidatesTags: ['Cart'],
    }),
    reduceInCart: builder.mutation<string, number>({
      query: (cartItemId) => ({
        url: '/Cart/reduce-product-in-cart',
        method: 'PUT',
        params: { id: cartItemId },
      }),
      transformResponse: (res: ApiResponse<string>) => res.data,
      invalidatesTags: ['Cart'],
    }),
    removeFromCart: builder.mutation<string, number>({
      query: (cartItemId) => ({
        url: '/Cart/delete-product-from-cart',
        method: 'DELETE',
        params: { id: cartItemId },
      }),
      transformResponse: (res: ApiResponse<string>) => res.data,
      invalidatesTags: ['Cart'],
    }),
    clearCart: builder.mutation<string, void>({
      query: () => ({ url: '/Cart/clear-cart', method: 'DELETE' }),
      transformResponse: (res: ApiResponse<string>) => res.data,
      invalidatesTags: ['Cart'],
    }),
  }),
})

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useIncreaseInCartMutation,
  useReduceInCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = cartApi
