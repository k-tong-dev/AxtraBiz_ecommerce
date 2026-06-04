'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { mockOrders } from '@/lib/mock-data'
import { Package, ChevronRight, CheckCircle, Clock, Truck } from 'lucide-react'

const statusIcons = {
  pending: <Clock className="w-5 h-5 text-yellow-500" />,
  confirmed: <CheckCircle className="w-5 h-5 text-blue-500" />,
  shipped: <Truck className="w-5 h-5 text-blue-500" />,
  delivered: <CheckCircle className="w-5 h-5 text-green-500" />,
  cancelled: <Clock className="w-5 h-5 text-red-500" />,
}

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

export default function OrdersPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/signin?redirect=/website/orders')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
            Redirecting to sign in...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground mb-8">Track and manage your orders</p>

        {mockOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-card border border-border rounded-lg">
            <Package className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-lg font-semibold mb-2">No orders yet</p>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
            <Link href="/website/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary transition cursor-pointer"
                onClick={() => router.push(`/website/orders/${order.id}`)}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-semibold">{order.id}</p>
                      <div className="flex items-center gap-1">
                        {statusIcons[order.status]}
                        <span className="text-sm font-medium">{statusLabels[order.status]}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Ordered on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="text-lg font-bold">${order.totalPrice.toFixed(2)}</p>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="mb-4 pb-4 border-b border-border">
                  <p className="text-sm text-muted-foreground mb-2">Items ({order.items.length})</p>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <p key={idx} className="text-sm line-clamp-1">
                        {item.productName} x{item.quantity}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Delivery to: {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  {order.trackingNumber && (
                    <p className="text-sm font-medium">Track: {order.trackingNumber}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
