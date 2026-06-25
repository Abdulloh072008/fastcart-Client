import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, Star } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useGetProductsQuery } from '@/services/productsApi'
import { useGetCategoriesQuery, useGetBrandsQuery } from '@/services/catalogApi'
import ProductCard from '@/components/ProductCard'
import type { GetProductsParams } from '@/types'

const PAGE_SIZE = 12

export default function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const urlCatId = searchParams.get('CategoryId')
  const urlSubId = searchParams.get('SubcategoryId')
  const urlSearch = searchParams.get('search') ?? ''

  const selectedCat = urlCatId ? Number(urlCatId) : undefined
  const selectedSub = urlSubId ? Number(urlSubId) : undefined

  const [selectedBrand, setSelectedBrand] = useState<number | undefined>(undefined)
  const [pendingMin, setPendingMin] = useState('')
  const [pendingMax, setPendingMax] = useState('')
  const [minPrice, setMinPrice] = useState<number | undefined>(undefined)
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [showMoreCats, setShowMoreCats] = useState(false)
  const [showMoreBrands, setShowMoreBrands] = useState(false)
  const [sortBy, setSortBy] = useState('popularity')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const priceInitializedForKey = useRef<string | null>(null)

  // Reset pageSize when URL-driven filters change
  const urlKey = `${urlCatId ?? ''}-${urlSubId ?? ''}-${urlSearch}`
  const [lastUrlKey, setLastUrlKey] = useState(urlKey)
  if (urlKey !== lastUrlKey) {
    setLastUrlKey(urlKey)
    setPageSize(PAGE_SIZE)
  }

  const params: GetProductsParams = {
    PageNumber: 1,
    PageSize: pageSize,
    ...(urlSearch ? { ProductName: urlSearch } : {}),
    ...(selectedCat ? { CategoryId: selectedCat } : selectedSub ? { SubcategoryId: selectedSub } : {}),
    ...(selectedBrand ? { BrandId: selectedBrand } : {}),
    ...(minPrice !== undefined ? { MinPrice: minPrice } : {}),
    ...(maxPrice !== undefined ? { MaxPrice: maxPrice } : {}),
  }

  const { data, isLoading, isFetching, isError } = useGetProductsQuery(params)
  const { data: categories, isLoading: catsLoading } = useGetCategoriesQuery()
  const { data: brands } = useGetBrandsQuery({ PageSize: 100 })

  const totalPages = data?.totalPage ?? 1
  const minMaxPrice = data?.data?.minMaxPrice
  const products = data?.data?.products ?? []
  const hasMore = pageSize / PAGE_SIZE < totalPages

  useEffect(() => {
    if (minMaxPrice && priceInitializedForKey.current !== urlKey) {
      setPendingMin(String(minMaxPrice.minPrice))
      setPendingMax(String(minMaxPrice.maxPrice))
      priceInitializedForKey.current = urlKey
    }
  }, [minMaxPrice, urlKey])

  function resetFilters() {
    setPageSize(PAGE_SIZE)
  }

  function applyPrice() {
    setMinPrice(pendingMin !== '' ? Number(pendingMin) : undefined)
    setMaxPrice(pendingMax !== '' ? Number(pendingMax) : undefined)
    resetFilters()
  }

  const visCats = showMoreCats ? (categories ?? []) : (categories ?? []).slice(0, 5)
  const visBrands = showMoreBrands ? (brands ?? []) : (brands ?? []).slice(0, 5)

  // ── Shared filter content (desktop sidebar + mobile drawer) ──────────────
  const filtersJSX = (
    <Accordion
      type="multiple"
      defaultValue={['category', 'brands', 'price', 'condition', 'ratings']}
      className="w-full"
    >
      {/* Category */}
      <AccordionItem value="category" className="border-border">
        <AccordionTrigger className="text-sm font-semibold py-3">Category</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-1.5 pb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchParams(prev => {
                const next = new URLSearchParams(prev)
                next.delete('CategoryId')
                next.delete('SubcategoryId')
                return next
              })}
              className={`w-full justify-start h-auto py-1 px-2 text-sm font-normal ${
                !selectedCat && !selectedSub
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground'
              }`}
            >
              All products
            </Button>
            {catsLoading
              ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-7 w-full mb-1" />)
              : visCats.map((cat) => (
                  <Button
                    key={cat.id}
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchParams(prev => {
                      const next = new URLSearchParams(prev)
                      next.set('CategoryId', String(cat.id))
                      next.delete('SubcategoryId')
                      return next
                    })}
                    className={`w-full justify-start h-auto py-1 px-2 text-sm font-normal ${
                      selectedCat === cat.id
                        ? 'text-primary font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {cat.categoryName}
                  </Button>
                ))}
            {(categories ?? []).length > 5 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowMoreCats((v) => !v)}
                className="h-auto py-0 px-2 text-xs text-primary"
              >
                {showMoreCats ? 'Show less' : 'See all'}
              </Button>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Brands */}
      <AccordionItem value="brands" className="border-border">
        <AccordionTrigger className="text-sm font-semibold py-3">Brands</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 pb-2">
            {visBrands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedBrand === brand.id}
                  onChange={() => {
                    setSelectedBrand(selectedBrand === brand.id ? undefined : brand.id)
                    resetFilters()
                  }}
                  className="w-4 h-4 accent-primary"
                />
                <span className="text-sm text-muted-foreground">{brand.brandName}</span>
              </label>
            ))}
            {(brands ?? []).length > 5 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setShowMoreBrands((v) => !v)}
                className="h-auto py-0 px-0 text-xs text-primary"
              >
                {showMoreBrands ? 'Show less' : 'See all'}
              </Button>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Price Range */}
      <AccordionItem value="price" className="border-border">
        <AccordionTrigger className="text-sm font-semibold py-3">Price Range</AccordionTrigger>
        <AccordionContent>
          <div className="pb-2 space-y-3">
            <div className="flex gap-2">
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Min</p>
                <Input
                  type="number"
                  value={pendingMin}
                  onChange={(e) => setPendingMin(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground mb-1">Max</p>
                <Input
                  type="number"
                  value={pendingMax}
                  onChange={(e) => setPendingMax(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={applyPrice}
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Apply
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Condition */}
      <AccordionItem value="condition" className="border-border">
        <AccordionTrigger className="text-sm font-semibold py-3">Condition</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 pb-2">
            {['Any', 'Refurbished', 'Brand new', 'Old items'].map((c, i) => (
              <label key={c} className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="condition" defaultChecked={i === 0} className="accent-primary" />
                <span className="text-sm text-muted-foreground">{c}</span>
              </label>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Ratings */}
      <AccordionItem value="ratings" className="border-border last:border-b-0">
        <AccordionTrigger className="text-sm font-semibold py-3">Ratings</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 pb-2">
            {[5, 4, 3, 2].map((stars) => (
              <label key={stars} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-primary" />
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-3.5 h-3.5"
                      style={s <= stars ? { fill: '#FFAD33', color: '#FFAD33' } : { color: '#d1d5db' }}
                    />
                  ))}
                </div>
              </label>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">
          {urlSearch ? `Results for "${urlSearch}"` : 'Explore Our Products'}
        </span>
      </nav>

      <div className="flex gap-6">
        {/* ── Desktop sidebar ─────────────────────────────────────────────── */}
        <aside className="w-[220px] shrink-0 hidden md:block">
          {filtersJSX}
        </aside>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between mb-6 gap-3">
            {/* Mobile filter drawer */}
            <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 overflow-y-auto">
                <SheetHeader className="mb-4">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                {filtersJSX}
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 ml-auto">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isError && (
            <p className="text-center py-12 text-destructive">Failed to load products.</p>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-72 rounded" />)}
            </div>
          ) : products.length === 0 ? (
            <p className="text-center py-16 text-muted-foreground">No products found. Try adjusting filters.</p>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-10">
                  <Button
                    onClick={() => setPageSize((ps) => ps + PAGE_SIZE)}
                    disabled={isFetching}
                    className="px-10"
                  >
                    {isFetching ? 'Loading…' : 'More Products'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
