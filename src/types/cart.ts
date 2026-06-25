import type { ProductListItem } from '@/types/product'

// A single line in the cart. NOTE: `id` here is the cart-line id used by the
// increase / reduce / delete endpoints — it is NOT the product id (add-to-cart
// uses the product id instead).
export interface CartItem {
  product: ProductListItem
  id: number
  quantity: number
}

// Cart/get-products-from-cart returns `data: Cart[]` (an array of exactly one).
export interface Cart {
  productsInCart: CartItem[]
  totalProducts: number
  totalPrice: number
  totalDiscountPrice: number
}
