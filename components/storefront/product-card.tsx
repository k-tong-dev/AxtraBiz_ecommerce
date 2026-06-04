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

  // Category Color Accent Selection
  const getCategoryStyles = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'audio':
        return {
          bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
          border: 'group-hover:border-indigo-500/50',
          glow: 'group-hover:shadow-[0_0_20px_rgba(99,102,241,0.15)]',
        }
      case 'wearables':
        return {
          bg: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
          border: 'group-hover:border-cyan-500/50',
          glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
        }
      case 'photography':
        return {
          bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
          border: 'group-hover:border-amber-500/50',
          glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
        }
      case 'computers':
        return {
          bg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
          border: 'group-hover:border-violet-500/50',
          glow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]',
        }
      case 'gaming':
        return {
          bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
          border: 'group-hover:border-rose-500/50',
          glow: 'group-hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]',
        }
      default:
        return {
          bg: 'bg-muted-foreground/10 text-muted-foreground',
          border: 'group-hover:border-primary/50',
          glow: 'group-hover:shadow-[0_0_20px_rgba(79,70,229,0.15)]',
        }
    }
  }

  const categoryStyles = getCategoryStyles(product.category)

  return (
    <div className={`glass-panel rounded-3xl overflow-hidden border border-border/60 hover:shadow-2xl transition-all duration-500 group flex flex-col h-full ${categoryStyles.border} ${categoryStyles.glow}`}>
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square bg-muted/30">
        <Image
          src={product.image_ids?.[0] || '/placeholder.svg'}
          alt={product.name}
          fill
          loading="eager"
          className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Shading/Glass Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          {/* Wishlist button */}
          <button
            onClick={() => toggleWishlist(product.id)}
            className="p-2.5 bg-background/80 backdrop-blur-md rounded-full border border-border/40 hover:bg-background hover:scale-110 transition duration-300 shadow-md group/heart"
          >
            <Heart
              className={`w-4 h-4 transition-transform duration-300 group-hover/heart:scale-125 ${
                isFavorited ? 'fill-destructive text-destructive' : 'text-muted-foreground'
              }`}
            />
          </button>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <span className="bg-destructive/95 backdrop-blur-sm text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Stock Status overlay */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white text-sm font-bold tracking-wider uppercase border-2 border-white/30 px-4 py-2 rounded-xl">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content details */}
      <div className="p-5 flex flex-col flex-1 gap-4">
        {/* Category & Rating */}
        <div className="flex items-center justify-between">
          <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${categoryStyles.bg}`}>
            {product.category}
          </span>
          <div className="flex items-center gap-1 bg-muted/40 px-2 py-0.5 rounded-md border border-border/30">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-foreground">{product.rating}</span>
            <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
          </div>
        </div>

        {/* Name and description snippet */}
        <div className="flex flex-col gap-1.5 flex-grow">
          <Link href={`/website/products/${product.id}`}>
            <h3 className="font-bold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors duration-300">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Cart Actions footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground leading-none mb-1">Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black">${product.price.toFixed(2)}</span>
              {product.original_price && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.original_price.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => addItem(product, 1)}
            disabled={product.stock === 0}
            className="rounded-xl px-4 py-4 h-9 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 font-semibold gap-1.5"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
