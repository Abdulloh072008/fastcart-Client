import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, X } from 'lucide-react'
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useGetCartQuery,
  useIncreaseInCartMutation,
  useReduceInCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from '@/services/cartApi'
import { getImageUrl } from '@/utils/imageUrl'

export default function CartPage() {
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')
  const { data: cart, isLoading } = useGetCartQuery()
  const [increase] = useIncreaseInCartMutation()
  const [reduce] = useReduceInCartMutation()
  const [remove] = useRemoveFromCartMutation()
  const [clear] = useClearCartMutation()

  const items = cart?.productsInCart ?? []
  const subtotal = items.reduce((sum, i) => {
    const price = i.product.hasDiscount ? i.product.discountPrice : i.product.price
    return sum + price * i.quantity
  }, 0)

  async function handleRemove(cartItemId: number) {
    try { await remove(cartItemId).unwrap() }
    catch { toast.error('Could not remove item') }
  }

  async function handleClear() {
    try { await clear().unwrap(); toast.success('Cart cleared') }
    catch { toast.error('Could not clear cart') }
  }

  async function handleIncrease(cartItemId: number) {
    try { await increase(cartItemId).unwrap() }
    catch { toast.error('Error updating quantity') }
  }

  async function handleReduce(cartItemId: number, qty: number) {
    if (qty <= 1) { handleRemove(cartItemId); return }
    try { await reduce(cartItemId).unwrap() }
    catch { toast.error('Error updating quantity') }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Cart</span>
      </nav>

      {isLoading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-20 rounded" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg mb-4">Your cart is empty.</p>
          <Button asChild>
            <Link to="/catalog">Shop Now</Link>
          </Button>
        </div>
      ) : (
        <>
          {/* Cart Table */}
          <Card className="mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const price = item.product.hasDiscount ? item.product.discountPrice : item.product.price
                  return (
                    <TableRow key={item.id}>
                      {/* Product */}
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Link to={`/product/${item.product.id}`} className="shrink-0">
                            <div className="w-14 h-14 bg-[#F5F5F5] dark:bg-muted rounded flex items-center justify-center overflow-hidden">
                              <img
                                src={getImageUrl(item.product.image)}
                                alt={item.product.productName}
                                className="w-full h-full object-contain p-1"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                              />
                            </div>
                          </Link>
                          <Link
                            to={`/product/${item.product.id}`}
                            className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.product.productName}
                          </Link>
                        </div>
                      </TableCell>

                      {/* Price */}
                      <TableCell className="text-sm">${price.toFixed(2)}</TableCell>

                      {/* Quantity spinner */}
                      <TableCell>
                        <div className="flex items-center border border-border rounded-md w-fit overflow-hidden">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReduce(item.id, item.quantity)}
                            className="h-9 w-8 rounded-none border-r border-border"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-9 h-9 flex items-center justify-center text-sm border-r border-border">
                            {String(item.quantity).padStart(2, '0')}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleIncrease(item.id)}
                            className="h-9 w-8 rounded-none"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>

                      {/* Subtotal */}
                      <TableCell className="text-sm font-semibold">
                        ${(price * item.quantity).toFixed(2)}
                      </TableCell>

                      {/* Remove */}
                      <TableCell>
                        <Button
                          size="icon"
                          onClick={() => handleRemove(item.id)}
                          className="w-8 h-8 rounded-full bg-primary text-white hover:bg-primary/80"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Actions row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
            <Button variant="outline" asChild>
              <Link to="/catalog">Return To Shop</Link>
            </Button>
            <div className="flex gap-3">
              <Button variant="outline">Update Cart</Button>
              <Button
                variant="outline"
                onClick={handleClear}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Remove All
              </Button>
            </div>
          </div>

          {/* Coupon + Cart Total */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Coupon */}
            <div className="flex items-center gap-3">
              <Input
                placeholder="Coupon Code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                className="w-52"
              />
              <Button variant="outline">Apply</Button>
            </div>

            {/* Cart Total */}
            <Card className="ml-auto w-full max-w-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Cart Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-border">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-semibold text-base">
                  <span>Total:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full mt-2"
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
