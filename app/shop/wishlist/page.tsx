'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/storefront/product-card'
import { useAuth } from '@/hooks/use-auth'
import { useWishlist } from '@/hooks/use-wishlist'
import { mockProducts } from '@/lib/mock-data'

export default function WishlistPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const { wishlist } = useWishlist()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/shop/login?redirect=/shop/wishlist')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
            Redirecting to sign in...
          </div>
        </div>
      </div>
    )
  }

  const wishlistProducts = mockProducts.filter((p) => wishlist.includes(p.id))

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/shop/products" className="flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        {wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Heart className="w-12 h-12 text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-2">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-8">Start adding products to your wishlist</p>
            <Link href="/shop/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground mb-8">
              {wishlistProducts.length} item{wishlistProducts.length !== 1 ? 's' : ''} in your wishlist
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
