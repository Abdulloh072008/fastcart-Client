import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Heart, Minus, Plus, Star, Truck, RefreshCw } from 'lucide-react'
import { toast } from 'react-toastify'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetProductByIdQuery, useGetProductsQuery } from '@/services/productsApi'
import { cartApi, useAddToCartMutation, useIncreaseInCartMutation, useReduceInCartMutation, useGetCartQuery } from '@/services/cartApi'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { toggleWishlist, selectIsWishlisted } from '@/features/wishlist/wishlistSlice'
import ProductCard from '@/components/ProductCard'
import { getImageUrl } from '@/utils/imageUrl'
import { cn } from '@/lib/utils'

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

function StarRow({ count = 4, reviews = 88 }: { count?: number; reviews?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star 
            key={s}
            className="w-4 h-4"
            style={s <= count ? { fill: '#FFAD33', color: '#FFAD33' } : { color: '#d1d5db' }}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground">({reviews} Reviews)</span>
    </div>
  )
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const token = useAppSelector((s) => s.auth.token)

  const { data: product, isLoading, isError } = useGetProductByIdQuery(Number(id))
  const isWishlisted = useAppSelector(selectIsWishlisted(Number(id)))
  const { data: related } = useGetProductsQuery({ PageSize: 8 })
  const { data: cart } = useGetCartQuery(undefined, { skip: !token })

  const [addToCart] = useAddToCartMutation()
  const [increaseInCart] = useIncreaseInCartMutation()
  const [reduceInCart] = useReduceInCartMutation()

  const [localQty, setLocalQty] = useState(1)
  const [selectedSize, setSelectedSize] = useState('M')
  const [mainImage, setMainImage] = useState(0)
  const [adding, setAdding] = useState(false)
  const [mutating, setMutating] = useState(false)

  const cartLine = cart?.productsInCart.find((item) => item.product.id === Number(id))
  // When the product is already in cart show its real quantity; otherwise show the local counter.
  const displayQty = cartLine ? cartLine.quantity : localQty

  const images = product?.images ?? []
  const currentImage = getImageUrl(images[mainImage]?.images)
  const displayPrice = product?.hasDiscount ? product.discountPrice : product?.price ?? 0

  async function handleIncrease() {
    if (!token) { navigate('/login'); return }
    if (cartLine) {
      setMutating(true)
      try { await increaseInCart(cartLine.id).unwrap() } catch { toast.error('Could not update cart') } finally { setMutating(false) }
    } else {
      setLocalQty((q) => q + 1)
    }
  }

  async function handleDecrease() {
    if (!token) { navigate('/login'); return }
    if (cartLine) {
      if (cartLine.quantity <= 1) return
      setMutating(true)
      try { await reduceInCart(cartLine.id).unwrap() } catch { toast.error('Could not update cart') } finally { setMutating(false) }
    } else {
      setLocalQty((q) => Math.max(1, q - 1))
    }
  }

  async function handleAddToCart() {
    if (!token) { navigate('/login'); return }
    if (cartLine) { navigate('/cart'); return }

    const targetQty = localQty
    setAdding(true)
    try {
      // Add the first unit (addToCart takes a product id)
      await addToCart(Number(id)).unwrap()

      if (targetQty > 1) {
        // Re-fetch the cart to get the newly created line id, then increase
        const freshCart = await dispatch(
          cartApi.endpoints.getCart.initiate(undefined, { forceRefetch: true }),
        ).unwrap()
        const newLine = freshCart.productsInCart.find((i) => i.product.id === Number(id))
        if (newLine) {
          for (let i = 1; i < targetQty; i++) {
            await increaseInCart(newLine.id).unwrap()
          }
        }
      }

      toast.success(`Added ${targetQty} × ${product?.productName} to cart`)
      setLocalQty(1)
    } catch {
      toast.error('Could not add to cart')
    } finally {
      setAdding(false)
    }
  }

  const relatedProducts = (related?.data?.products ?? []).slice(0, 4)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          <div className="w-20 space-y-2">
            {[0,1,2,3].map(i => <Skeleton key={i} className="h-20 w-20 rounded" />)}
          </div>
          <Skeleton className="flex-1 aspect-square rounded max-w-md" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-muted-foreground">
        Product not found.{' '}
        <Link to="/catalog" className="text-primary hover:underline">Back to catalog</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">Account</Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-foreground">Products</Link>
        <span>/</span>
        <span className="text-foreground">{product.productName}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-45 mb-16">
        {/* ---- Left: image gallery ---- */}
        <div className="flex gap-3 flex-1 max-w-[600px]">
          {/* Thumbnails */}
          <div className="flex flex-col gap-2 shrink-0">
            {images.map((img, idx) => (
              <Button
                key={img.id}
                variant="outline"
                onClick={() => setMainImage(idx)}
                aria-label={`View image ${idx + 1}`}
                aria-pressed={mainImage === idx}
                className={cn(
                  'w-20 h-20 rounded-sm p-0 overflow-hidden bg-[#F5F5F5] dark:bg-muted transition-colors',
                  mainImage === idx ? 'border-2 border-primary' : 'border border-border hover:border-primary/50',
                )}
              >
                <img src={getImageUrl(img.images)} alt="" className="w-full h-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
              </Button>
            ))}
          </div>

          {/* Main image */}
          <div className="flex-1 bg-[#F5F5F5] dark:bg-muted rounded flex items-center justify-center aspect-square">
            {currentImage ? (
              <img src={currentImage} alt={product.productName} className="w-full h-full object-contain p-8" onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0' }} />
            ) : (
              <div className="text-muted-foreground text-sm">No image</div>
            )}
          </div>
        </div>

        {/* ---- Right: product info ---- */}
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">{product.productName}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRow />
            <span className="text-muted-foreground">|</span>
            <span className="text-green-500 text-sm font-medium">In Stock</span>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <span className="text-2xl font-medium">${displayPrice.toFixed(2)}</span>
            {product.hasDiscount && (
              <span className="text-muted-foreground line-through text-lg">${product.price.toFixed(2)}</span>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed mb-6 border-b border-border pb-6">
            {product.description || 'High quality product with excellent features and performance.'}
          </p>

          {/* Colours */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-sm font-medium">Colours:</span>
            <div className="flex gap-2">
              {['#7B61FF', '#E53E3E'].map((c) => (
                <button
                  key={c}
                  aria-label={`Select color ${c}`}
                  className="w-5 h-5 rounded-full border-2 border-white shadow ring-1 ring-gray-300 hover:ring-primary transition-all"
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-medium">Size:</span>
            <div className="flex gap-2">
              {SIZES.map((s) => (
                <Button
                  key={s}
                  variant={selectedSize === s ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setSelectedSize(s)}
                  aria-pressed={selectedSize === s}
                  aria-label={`Size ${s}`}
                  className={cn(
                    'w-8 h-8 text-xs rounded-sm',
                    selectedSize === s ? '' : 'hover:border-primary',
                  )}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          {/* Qty + Buy Now + Wishlist */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center border border-border rounded-md overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDecrease}
                disabled={mutating}
                className="h-11 w-9 rounded-none border-r border-border"
              >
                <Minus className="w-3.5 h-3.5" />
              </Button>
              <span className="w-10 h-11 flex items-center justify-center text-sm font-medium">
                {displayQty}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleIncrease}
                disabled={mutating}
                className="h-11 w-9 rounded-none border-l border-border"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex-1"
            >
              {adding ? 'Adding…' : cartLine ? 'Go to Cart' : 'Buy Now'}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => dispatch(toggleWishlist(product.id))}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              className={cn(
                'w-11 h-11 rounded-sm',
                isWishlisted ? 'border-primary text-primary' : 'hover:border-primary',
              )}
            >
              <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
            </Button>
          </div>

          {/* Delivery info */}
          <Card className="overflow-hidden divide-y divide-border rounded-sm">
            <CardContent className="flex items-center gap-4 p-4">
              <Truck className="w-8 h-8 shrink-0" />
              <div>
                <p className="text-sm font-medium">Free Delivery</p>
                <p className="text-xs text-muted-foreground">Enter your postal code for Delivery Availability</p>
              </div>
            </CardContent>
            <CardContent className="flex items-center gap-4 p-4">
              <RefreshCw className="w-8 h-8 shrink-0" />
              <div>
                <p className="text-sm font-medium">Return Delivery</p>
                <p className="text-xs text-muted-foreground">Free 30 Days Delivery Returns. <span className="underline cursor-pointer">Details</span></p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Related Items */}
      {relatedProducts.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-5 h-10 rounded bg-primary" />
            <span className="text-primary text-sm font-semibold">Related Item</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
