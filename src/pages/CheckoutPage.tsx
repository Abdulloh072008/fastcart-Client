import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  useForm,
  type UseFormRegister,
  type FieldErrors,
  type Path,
} from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'react-toastify'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useGetCartQuery, useClearCartMutation } from '@/services/cartApi'
import { useAppDispatch } from '@/app/hooks'
import { placeOrder } from '@/features/orders/ordersSlice'
import { getImageUrl } from '@/utils/imageUrl'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  streetAddress: z.string().min(1, 'Required'),
  apartment: z.string().optional(),
  townCity: z.string().min(1, 'Required'),
  phoneNumber: z.string().min(6, 'Invalid phone'),
  email: z.string().email('Invalid email'),
  saveInfo: z.boolean().optional(),
})
type FormData = z.infer<typeof schema>

// Module-level so it is not recreated on each render
function Field({
  name,
  placeholder,
  type = 'text',
  optional,
  register,
  errors,
}: {
  name: Path<FormData>
  placeholder: string
  type?: string
  optional?: boolean
  register: UseFormRegister<FormData>
  errors: FieldErrors<FormData>
}) {
  return (
    <div>
      <Input
        type={type}
        placeholder={placeholder + (optional ? ' (optional)' : '')}
        {...register(name)}
        className={errors[name] ? 'border-destructive' : ''}
      />
      {errors[name] && (
        <p className="text-xs text-destructive mt-1">{errors[name]?.message as string}</p>
      )}
    </div>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cash'>('cash')
  const [coupon, setCoupon] = useState('')
  const [placing, setPlacing] = useState(false)

  const { data: cart, isLoading } = useGetCartQuery()
  const [clearCart] = useClearCartMutation()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const items = cart?.productsInCart ?? []
  const subtotal = items.reduce((sum, i) => {
    const price = i.product.hasDiscount ? i.product.discountPrice : i.product.price
    return sum + price * i.quantity
  }, 0)

  async function onSubmit(data: FormData) {
    if (items.length === 0) { toast.error('Your cart is empty'); return }
    setPlacing(true)
    try {
      dispatch(placeOrder({
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.productName,
          image: i.product.image,
          price: i.product.hasDiscount ? i.product.discountPrice : i.product.price,
          quantity: i.quantity,
          subtotal: (i.product.hasDiscount ? i.product.discountPrice : i.product.price) * i.quantity,
        })),
        subtotal,
        shipping: 0,
        total: subtotal,
        billing: {
          firstName: data.firstName,
          lastName: data.lastName,
          streetAddress: data.streetAddress,
          apartment: data.apartment,
          townCity: data.townCity,
          phoneNumber: data.phoneNumber,
          email: data.email,
        },
        paymentMethod: paymentMethod === 'bank' ? 'Bank Transfer' : 'Cash on delivery',
      }))
      await clearCart().unwrap()
      navigate('/order-confirmation')
    } catch {
      toast.error('Could not place order')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">Product</Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-foreground">View Cart</Link>
        <span>/</span>
        <span className="text-foreground font-medium">CheckOut</span>
      </nav>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-10">
        {/* ---- Left: Billing form ---- */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-8">Billing Details</h2>

          <div className="bg-card border border-border rounded p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field name="firstName" placeholder="First name" register={register} errors={errors} />
              <Field name="lastName" placeholder="Last name" register={register} errors={errors} />
            </div>
            <Field name="streetAddress" placeholder="Street address" register={register} errors={errors} />
            <Field name="apartment" placeholder="Apartment, floor, etc" optional register={register} errors={errors} />
            <Field name="townCity" placeholder="Town/City" register={register} errors={errors} />
            <Field name="phoneNumber" placeholder="Phone number" type="tel" register={register} errors={errors} />
            <Field name="email" placeholder="Email address" type="email" register={register} errors={errors} />

            <label className="flex items-center gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                {...register('saveInfo')}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm">Save this information for faster check-out next time</span>
            </label>
          </div>
        </div>

        {/* ---- Right: Order summary ---- */}
        <div className="lg:w-[380px] shrink-0">
          <div className="space-y-4 mb-6">
            {isLoading ? (
              [0, 1].map((i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-border">
                  <div className="w-12 h-12 bg-muted rounded" />
                </div>
              ))
            ) : (
              items.map((item) => {
                const price = item.product.hasDiscount ? item.product.discountPrice : item.product.price
                return (
                  <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border">
                    <div className="relative">
                      <div className="w-12 h-12 bg-[#F5F5F5] dark:bg-muted rounded overflow-hidden flex items-center justify-center">
                        <img
                          src={getImageUrl(item.product.image)}
                          alt={item.product.productName}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                        />
                      </div>
                      <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <span className="flex-1 text-sm">{item.product.productName}</span>
                    <span className="text-sm font-medium">${(price * item.quantity).toFixed(2)}</span>
                  </div>
                )
              })
            )}
          </div>

          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between py-2 border-b border-border">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between py-2 font-semibold text-base">
              <span>Total:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment methods */}
          <div className="space-y-3 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === 'bank'}
                onChange={() => setPaymentMethod('bank')}
                className="accent-primary"
              />
              <span className="text-sm font-medium">Bank</span>
              <div className="ml-auto flex gap-1">
                {['Visa', 'MC', 'Mir'].map((c) => (
                  <span key={c} className="px-1.5 py-0.5 bg-muted text-xs rounded">{c}</span>
                ))}
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={paymentMethod === 'cash'}
                onChange={() => setPaymentMethod('cash')}
                className="accent-primary"
              />
              <span className="text-sm font-medium">Cash on delivery</span>
            </label>
          </div>

          {/* Coupon */}
          <div className="flex gap-3 mb-6">
            <Input
              placeholder="Coupon Code"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <Button
              type="button"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white shrink-0"
            >
              Apply
            </Button>
          </div>

          <Button
            type="submit"
            disabled={placing}
            className="w-full bg-primary text-white hover:bg-primary/90 py-3"
          >
            {placing ? 'Placing Order…' : 'Place Order'}
          </Button>
        </div>
      </form>
    </div>
  )
}
