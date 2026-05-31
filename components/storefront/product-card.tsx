'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/types'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const isFavorited = isInWishlist(product.id)

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-300 group">
      {/* Image */}
      <div className="relative overflow-hidden bg-muted aspect-square">
        <Image
          src={product.image_ids?.[0] || '/placeholder.svg'}
          alt={product.name}
          fill
          loading="eager"
          className="object-cover group-hover:scale-120 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-4 right-4 bg-destructive/90 backdrop-blur-sm text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            -{discountPercent}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-4 left-4 p-2 bg-background/80 backdrop-blur rounded-full hover:bg-background transition"
        >
          <Heart
            className={`w-5 h-5 ${isFavorited ? 'fill-destructive text-destructive' : 'text-foreground'}`}
          />
        </button>

        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Category */}
        <span className="text-xs text-primary font-semibold uppercase">{product.category}</span>

        {/* Name */}
        <Link href={`/shop/products/${product.id}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition">{product.name}</h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
          {product.original_price && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.original_price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          size="sm"
          onClick={() => addItem(product, 1)}
          disabled={product.stock === 0}
          className="w-full gap-2 mt-auto"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  )
}
