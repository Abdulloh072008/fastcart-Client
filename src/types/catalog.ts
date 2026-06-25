// Catalog controllers: Category, SubCategory, Brand, Color.

export interface SubCategory {
  id: number
  subCategoryName: string
}

export interface Category {
  id: number
  categoryImage: string
  subCategories: SubCategory[]
  categoryName: string
}

export interface Brand {
  id: number
  brandName: string
}

export interface Color {
  id: number
  colorName: string
}

export interface GetBrandsParams {
  BrandName?: string
  BrandId?: number
  PageNumber?: number
  PageSize?: number
}

export interface GetColorsParams {
  ColorName?: string
  PageNumber?: number
  PageSize?: number
}
