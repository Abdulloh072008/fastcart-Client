import { Eye, Heart, ShoppingCart, Star } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { toggleWishlist, selectIsWishlisted } from '@/features/wishlist/wishlistSlice'
import { useAddToCartMutation, useGetCartQuery, useIncreaseInCartMutation } from '@/services/cartApi'
import type { ProductListItem } from '@/types'
import { cn } from '@/lib/utils'
import { getImageUrl } from '@/utils/imageUrl'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export default function ProductCard({ product }: { product: ProductListItem }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const token = useAppSelector((s) => s.auth.token)
  const isWishlisted = useAppSelector(selectIsWishlisted(product.id))

  const { data: cart } = useGetCartQuery(undefined, { skip: !token })
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation()
  const [increaseInCart, { isLoading: isIncreasing }] = useIncreaseInCartMutation()
  const isLoading = isAdding || isIncreasing

  const cartLine = cart?.productsInCart.find((item) => item.product.id === product.id)

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleWishlist(product.id))
  }

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (!token) { navigate('/login'); return }
    try {
      if (cartLine) {
        await increaseInCart(cartLine.id).unwrap()
      } else {
        await addToCart(product.id).unwrap()
      }
      toast.success('Added to cart')
    } catch {
      toast.error('Could not add to cart')
    }
  }

  const displayPrice = product.hasDiscount ? product.discountPrice : product.price
  const discountPct = product.hasDiscount
    ? Math.round((1 - product.discountPrice / product.price) * 100)
    : 0

  return (
    <Card className="group pt-0 relative overflow-hidden border border-border hover:shadow-md transition-shadow rounded-sm">
      {/* ---- Image area ---- */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative bg-[#F5F5F5] dark:bg-muted aspect-square flex items-center justify-center overflow-hidden">
          <img
            src={getImageUrl(product.image)}
            alt={product.productName}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />

          {product.hasDiscount && (
            <Badge className="absolute top-3 left-3 bg-primary text-white text-xs rounded-sm px-2 py-0.5 shadow-none">
              -{discountPct}%
            </Badge>
          )}

          {/* Action icons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={handleWishlist}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={cn(
                'w-8 h-8 rounded-full bg-white shadow hover:bg-primary hover:text-white dark:bg-background',
                isWishlisted ? 'text-primary' : 'text-gray-800 dark:text-foreground',
              )}
            >
              <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              asChild
              className="w-8 h-8 rounded-full bg-white shadow hover:bg-primary hover:text-white dark:bg-background text-gray-800 dark:text-foreground"
            >
              <Link to={`/product/${product.id}`} aria-label="Quick view" onClick={(e) => e.stopPropagation()}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Add to Cart bar */}
          <Button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="absolute bottom-0 inset-x-0 rounded-none bg-black hover:bg-black/90 text-white text-xs font-medium h-9 gap-1.5 translate-y-full group-hover:translate-y-0 transition-transform duration-200 disabled:opacity-70"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {isLoading ? 'Adding…' : 'Add To Cart'}
          </Button>
        </div>
      </Link>

      {/* ---- Info area ---- */}
      <CardContent className="">
        <Link
          to={`/product/${product.id}`}
          className="block text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1 mb-1.5"
        >
          {product.productName}
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <span className="text-primary font-semibold text-sm">${displayPrice.toFixed(2)}</span>
          {product.hasDiscount && (
            <span className="text-muted-foreground text-xs line-through">${product.price.toFixed(2)}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className="w-3 h-3"
                style={i <= 4 ? { fill: '#FFAD33', color: '#FFAD33' } : { color: '#d1d5db' }}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">(88)</span>
        </div>
      </CardContent>
    </Card>
  )
}
