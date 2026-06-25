import type { Brand, Color } from '@/types/catalog'

// Product/get-products list item.
export interface ProductInfoFromCart {
  id: number
  quantity: number
}

export interface ProductListItem {
  id: number
  productName: string
  image: string
  color: string
  price: number
  hasDiscount: boolean
  discountPrice: number
  quantity: number
  productInMyCart: boolean
  categoryId: number
  categoryName: string | null
  productInfoFromCart: ProductInfoFromCart | null
}

export interface MinMaxPrice {
  minPrice: number
  maxPrice: number
}

// `data` payload of Product/get-products: the page of products plus the full
// set of colors/brands and the price bounds, for building catalog filters.
export interface ProductsData {
  products: ProductListItem[]
  colors: Color[]
  brands: Brand[]
  minMaxPrice: MinMaxPrice
}

// Product/get-product-by-id payload.
export interface ProductImage {
  id: number
  images: string
}

export interface ProductReviewUser {
  userId: string
  userName: string
  fullName: string
  imageName: string
}

export interface ProductDetail {
  id: number
  brand: string
  color: string
  productInMyCart: boolean
  images: ProductImage[]
  users: ProductReviewUser[]
  productInfoFromCart: ProductInfoFromCart | null
  productName: string
  description: string
  quantity: number
  weight: number | null
  size: string | null
  code: string
  price: number
  hasDiscount: boolean
  discountPrice: number
  subCategoryId: number
}

// Query string for Product/get-products. PascalCase to match the API exactly.
export interface GetProductsParams {
  UserId?: string
  ProductName?: string
  MinPrice?: number
  MaxPrice?: number
  BrandId?: number
  ColorId?: number
  CategoryId?: number
  SubcategoryId?: number
  PageNumber?: number
  PageSize?: number
}
