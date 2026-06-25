import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/app/hooks'
import { selectLastOrderId, selectOrders } from '@/features/orders/ordersSlice'
import { getImageUrl } from '@/utils/imageUrl'

export default function OrderConfirmationPage() {
  const lastOrderId = useAppSelector(selectLastOrderId)
  const orders = useAppSelector(selectOrders)
  const order = orders.find((o) => o.id === lastOrderId)

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
          {order && (
            <p className="text-muted-foreground text-sm">
              Order ID: <span className="font-mono font-medium text-foreground">{order.id}</span>
            </p>
          )}
          <p className="text-muted-foreground text-sm mt-1">
            Thank you for your purchase. We'll send you an email confirmation shortly.
          </p>
        </div>

        {order && (
          <div className="w-full border border-border rounded p-5 text-left space-y-3">
            <h3 className="font-semibold text-sm mb-3">Order Summary</h3>
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 text-sm">
                <div className="w-10 h-10 bg-[#F5F5F5] dark:bg-muted rounded overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={getImageUrl(item.image)} alt={item.productName} className="w-full h-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                </div>
                <span className="flex-1 line-clamp-1">{item.productName}</span>
                <span className="text-muted-foreground">×{item.quantity}</span>
                <span className="font-medium">${item.subtotal.toFixed(2)}</span>
              </div>
            ))}
            <div className="pt-3 border-t border-border flex justify-between font-semibold">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
            <Link to="/orders">My Orders</Link>
          </Button>
          <Button asChild className="bg-primary text-white hover:bg-primary/90">
            <Link to="/catalog">Continue Shopping</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
