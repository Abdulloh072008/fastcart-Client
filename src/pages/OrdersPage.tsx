import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/app/hooks'
import { selectOrders } from '@/features/orders/ordersSlice'
import { getImageUrl } from '@/utils/imageUrl'

const STATUS_COLORS: Record<string, string> = {
  Processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default function OrdersPage() {
  const orders = useAppSelector(selectOrders)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">My Orders</span>
      </nav>

      <h1 className="text-xl font-semibold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-20">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">No orders yet.</p>
          <Button asChild className="bg-primary text-white hover:bg-primary/90">
            <Link to="/catalog">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-border rounded p-5">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <p className="font-medium font-mono text-sm">{order.id}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                  {order.status}
                </span>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 bg-[#F5F5F5] dark:bg-muted rounded shrink-0 overflow-hidden flex items-center justify-center">
                      <img src={getImageUrl(item.image)} alt={item.productName} className="w-full h-full object-contain p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    </div>
                    <span className="flex-1 line-clamp-1 text-muted-foreground">{item.productName}</span>
                    <span className="text-muted-foreground">×{item.quantity}</span>
                    <span>${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {order.paymentMethod}
                </span>
                <span className="font-semibold">Total: ${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
