import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/app/store'

export interface OrderItem {
  productId: number
  productName: string
  image: string
  price: number
  quantity: number
  subtotal: number
}

export interface Order {
  id: string
  createdAt: string
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  billing: {
    firstName: string
    lastName: string
    streetAddress: string
    apartment?: string
    townCity: string
    phoneNumber: string
    email: string
  }
  paymentMethod: string
}

const STORAGE_KEY = 'fastcart_orders'

function load(): Order[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(orders: Order[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { list: load(), lastOrderId: null as string | null },
  reducers: {
    placeOrder(state, action: PayloadAction<Omit<Order, 'id' | 'createdAt' | 'status'>>) {
      const order: Order = {
        ...action.payload,
        id: `FC-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'Processing',
      }
      state.list.unshift(order)
      state.lastOrderId = order.id
      save(state.list)
    },
  },
})

export const { placeOrder } = ordersSlice.actions
export const selectOrders = (state: RootState) => state.orders.list
export const selectLastOrderId = (state: RootState) => state.orders.lastOrderId
export default ordersSlice.reducer
