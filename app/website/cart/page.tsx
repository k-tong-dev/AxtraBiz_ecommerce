'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { useAuth } from '@/hooks/use-auth'
import { mockProducts } from '@/lib/mock/mock-data'

export default function CartPage() {
  const { items, totalPrice, updateQuantity, removeItem, clearCart } = useCart()
  const { isAuthenticated } = useAuth()

  const cartProducts = items
    .map((item) => ({
      ...item,
      product: mockProducts.find((p) => p.id === item.productId),
    }))
    .filter((item) => item.product)

  const subtotal = totalPrice
  const shipping = subtotal > 100 ? 0 : 10
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  if (items.length === 0) {
    return (
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/website/products" className="flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>

          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-3xl font-bold mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Add some products to get started</p>
            <Link href="/website/products">
              <Button size="lg">Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/website/products" className="flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

            <div className="space-y-4 mb-6">
              {cartProducts.map((item) => (
                <div key={item.productId} className="flex gap-4 p-4 bg-card rounded-lg border border-border">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                    <Image
                      src={item.product!.image}
                      alt={item.product!.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/website/products/${item.productId}`}>
                      <h3 className="font-semibold hover:text-primary transition line-clamp-1">
                        {item.product!.name}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-2">
                      ${item.product!.price.toFixed(2)} each
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 hover:bg-secondary rounded disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-secondary rounded"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="flex flex-col items-end gap-4">
                    <span className="font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-2 hover:bg-destructive/10 text-destructive rounded transition"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card border border-border rounded-lg p-6 h-fit sticky top-20">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>

              {shipping === 0 && (
                <p className="text-xs text-green-600 font-semibold">Free shipping applied!</p>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (estimated)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            {isAuthenticated ? (
              <Link href="/website/checkout" className="w-full">
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>
            ) : (
              <Link href="/auth/signin?redirect=/website/checkout" className="w-full">
                <Button size="lg" className="w-full">
                  Sign in to Checkout
                </Button>
              </Link>
            )}

            <p className="text-xs text-muted-foreground text-center mt-4">
              Free returns within 30 days of purchase
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
