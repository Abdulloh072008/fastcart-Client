import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { removeFromWishlist, clearWishlist } from '@/features/wishlist/wishlistSlice'
import { useGetProductsQuery } from '@/services/productsApi'
import { useAddToCartMutation, useGetCartQuery, useIncreaseInCartMutation } from '@/services/cartApi'
import ProductCard from '@/components/ProductCard'
import { getImageUrl } from '@/utils/imageUrl'

export default function WishlistPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const token = useAppSelector((s) => s.auth.token)
  const wishlistIds = useAppSelector((s) => s.wishlist.ids)

  const { data: allData, isLoading } = useGetProductsQuery({ PageSize: 100 })
  const { data: cart } = useGetCartQuery(undefined, { skip: !token })
  const [addToCart] = useAddToCartMutation()
  const [increaseInCart] = useIncreaseInCartMutation()

  const allProducts = allData?.data.products ?? []
  const wishlistItems = allProducts.filter((p) => wishlistIds.includes(p.id))
  const justForYou = allProducts.filter((p) => !wishlistIds.includes(p.id)).slice(0, 4)

  async function handleAddToCart(productId: number) {
    if (!token) { navigate('/login'); return }
    try {
      const cartLine = cart?.productsInCart.find((i) => i.product.id === productId)
      if (cartLine) {
        await increaseInCart(cartLine.id).unwrap()
      } else {
        await addToCart(productId).unwrap()
      }
      toast.success('Added to cart')
    } catch {
      toast.error('Could not add to cart')
    }
  }

  async function handleMoveAll() {
    if (!token) { navigate('/login'); return }
    for (const item of wishlistItems) {
      try {
        const cartLine = cart?.productsInCart.find((i) => i.product.id === item.id)
        if (cartLine) {
          await increaseInCart(cartLine.id).unwrap()
        } else {
          await addToCart(item.id).unwrap()
        }
      } catch {
        // continue
      }
    }
    dispatch(clearWishlist())
    toast.success('All items moved to cart')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Wishlist header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-xl font-semibold">Wishlist ({wishlistIds.length})</h1>
        <Button variant="outline" onClick={handleMoveAll} disabled={wishlistItems.length === 0} className="border-foreground text-foreground hover:bg-foreground hover:text-background">
          Move All To Bag
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[0,1,2,3].map(i => <Skeleton key={i} className="h-64 rounded" />)}
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-16 mb-12">
          <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
          <Button asChild className="bg-primary text-white hover:bg-primary/90">
            <Link to="/catalog">Explore Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {wishlistItems.map((product) => {
            const displayPrice = product.hasDiscount ? product.discountPrice : product.price
            const discountPct = product.hasDiscount
              ? Math.round((1 - product.discountPrice / product.price) * 100)
              : 0
            return (
              <div key={product.id} className="group relative bg-card rounded overflow-hidden border border-border">
                {/* Image area */}
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative bg-[#F5F5F5] dark:bg-muted aspect-square flex items-center justify-center">
                    <img
                      src={getImageUrl(product.image)}
                      alt={product.productName}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                    />
                    {product.hasDiscount && (
                      <span className="absolute top-3 left-3 bg-primary text-white text-xs font-medium px-2 py-0.5 rounded-sm">
                        -{discountPct}%
                      </span>
                    )}
                    {/* Remove from wishlist */}
                    <button
                      onClick={(e) => { e.preventDefault(); dispatch(removeFromWishlist(product.id)) }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                    {/* Add to cart bar */}
                    <button
                      onClick={(e) => { e.preventDefault(); handleAddToCart(product.id) }}
                      className="absolute bottom-0 inset-x-0 bg-black text-white text-xs font-medium py-2.5 flex items-center justify-center gap-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add To Cart
                    </button>
                  </div>
                </Link>
                {/* Info */}
                <div className="p-3">
                  <p className="text-sm font-medium line-clamp-1 mb-1">{product.productName}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-primary text-sm font-semibold">${displayPrice.toFixed(2)}</span>
                    {product.hasDiscount && (
                      <span className="text-muted-foreground text-xs line-through">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Just For You */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-10 rounded bg-primary" />
          <span className="font-semibold text-base">Just For You</span>
        </div>
        <Button variant="outline" asChild className="border-foreground text-foreground hover:bg-foreground hover:text-background">
          <Link to="/catalog">See All</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0,1,2,3].map(i => <Skeleton key={i} className="h-64 rounded" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {justForYou.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
