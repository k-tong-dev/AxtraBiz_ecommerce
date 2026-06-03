'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, Minus, Plus, ArrowLeft, Sparkles, Truck, ShieldCheck, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { mockProducts } from '@/lib/mock-data'
import type { Product } from '@/lib/types'
import { useCart } from '@/hooks/use-cart'
import { useWishlist } from '@/hooks/use-wishlist'
import { ProductCard } from '@/components/storefront/product-card'
import { useParams } from 'next/navigation'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  const initialProduct = mockProducts.find((p) => p.id === Number(productId)) ?? null
  const [product, setProduct] = useState<Product | null>(initialProduct)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState<'features' | 'reviews' | 'shipping'>('features')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/api/admin/products/${productId}`)
        if (!res.ok) {
          console.error('[ShopProductDetail] API error:', res.status)
          return
        }
        const data = await res.json()
        console.log('[ShopProductDetail] Fetched product from Drizzle:', data?.id)
        if (!mounted) return
        if (data) setProduct(mapDrizzleProductToShop(data))
      } catch (err) {
        console.error('[ShopProductDetail] Fetch failed:', err)
      }
    })()
    return () => {
      mounted = false
    }
  }, [productId])

  if (!product) {
    return (
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/shop/products" className="flex items-center gap-2 text-primary hover:underline mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <p className="text-lg">Product not found</p>
        </div>
      </div>
    )
  }

  const relatedProducts = mockProducts.filter(
    (p) => p.category === product.category && p.id !== product.id
  )
  const isFavorited = isInWishlist(product.id)
  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0
  const images = product.image_ids?.length ? product.image_ids : ['/placeholder.svg']

  const handleAddToCart = () => {
    addItem(product, quantity)
    setQuantity(1)
  }

  return (
    <div className="py-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/shop/products" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 mb-8 group transition-colors duration-300">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Collections
        </Link>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted/30 border border-border/60 glass-panel shadow-xl">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                priority
                className="object-cover"
              />
              {discountPercent > 0 && (
                <div className="absolute top-6 right-6 bg-destructive text-destructive-foreground px-4 py-1.5 rounded-full text-xs font-black shadow-lg">
                  -{discountPercent}% OFF
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-md ${
                      selectedImage === idx
                        ? 'border-primary ring-2 ring-primary/30 scale-105'
                        : 'border-border/60 hover:border-primary/50'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Specs & CTAs */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              {/* Category & Badge */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg">
                  {product.category}
                </span>
                {product.stock > 0 ? (
                  <span className="text-[10px] font-bold text-green-600 bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg">
                    In Stock ({product.stock} units)
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-destructive bg-destructive/10 border border-destructive/20 px-3 py-1.5 rounded-lg">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-foreground">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/25 px-2.5 py-1 rounded-lg">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-foreground">{product.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground font-semibold">
                  ({product.reviews} customer reviews)
                </span>
              </div>

              {/* Price Section */}
              <div className="flex items-end gap-3 pt-2">
                <span className="text-3xl font-black text-foreground">${product.price.toFixed(2)}</span>
                {product.original_price && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.original_price.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-destructive bg-destructive/10 border border-destructive/20 px-2.5 py-0.5 rounded-md">
                      Save ${(product.original_price - product.price).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* CTAs */}
            <div className="space-y-4 pt-4 border-t border-border/40">
              <div className="flex flex-col sm:flex-row gap-4">
                
                {/* Quantity Controls */}
                <div className="flex items-center justify-between border border-border/80 rounded-xl bg-muted/20 px-4 h-12 w-full sm:w-36">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || product.stock === 0}
                    className="p-1 hover:bg-background rounded-lg disabled:opacity-30 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold text-sm w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock || product.stock === 0}
                    className="p-1 hover:bg-background rounded-lg disabled:opacity-30 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart button */}
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 rounded-xl h-12 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all font-semibold gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Shopping Cart
                </Button>

                {/* Wishlist Button */}
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => toggleWishlist(product.id)}
                  className="rounded-xl h-12 w-12 p-0 group"
                >
                  <Heart
                    className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                      isFavorited ? 'fill-destructive text-destructive' : 'text-muted-foreground'
                    }`}
                  />
                </Button>
              </div>

              {/* Badges footer */}
              <div className="grid grid-cols-3 gap-4 pt-4 text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center border-t border-border/30">
                <div className="flex flex-col items-center gap-1">
                  <Truck className="w-4 h-4 text-primary" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span>1-Year Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span>Premium Build</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Tabbed Info Pane */}
        <section className="mb-20">
          <div className="flex border-b border-border/50 gap-4 mb-6">
            <button
              onClick={() => setActiveTab('features')}
              className={`pb-3 text-sm font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'features' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Key Features
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'reviews' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Verified Reviews ({product.reviews})
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 text-sm font-bold tracking-wide transition-all border-b-2 ${
                activeTab === 'shipping' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Shipping & Returns
            </button>
          </div>

          <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-md">
            
            {activeTab === 'features' && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg mb-2">Highlights & Technical Details</h3>
                {product.features && product.features.length > 0 ? (
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/10 border border-border/40 p-3 rounded-2xl">
                        <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-primary" />
                        </div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No features specified for this item.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-border/30 pb-4">
                  <h3 className="font-bold text-lg">Customer Feedback</h3>
                  <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded text-xs font-bold text-amber-600">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {product.rating} / 5
                  </div>
                </div>
                <div className="space-y-4">
                  {/* Review 1 */}
                  <div className="border-b border-border/30 pb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm">Alexander G.</h4>
                      <span className="text-xs text-muted-foreground font-mono">Verified Purchase</span>
                    </div>
                    <div className="flex text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Absolutely stunning quality. Design details are top notch and fits in beautifully with my workspace setup. Delivery was fast too!
                    </p>
                  </div>
                  {/* Review 2 */}
                  <div className="pb-2 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm">Elena R.</h4>
                      <span className="text-xs text-muted-foreground font-mono">Verified Purchase</span>
                    </div>
                    <div className="flex text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 fill-current" /><Star className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Extremely sleek. Exactly what was described. I use it every single day. Highly recommend!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <h3 className="font-bold text-lg text-foreground mb-2">Delivery & Return Guidelines</h3>
                <p>
                  We dispatch orders within 24-48 hours. Orders above $100 qualify for **Free Standard Shipping** worldwide. Estimated delivery timelines range between 3 to 7 business days.
                </p>
                <p>
                  Not satisfied? We support **30-Day Hassle-Free Returns**. Return the product in its original packaging for a full, immediate refund.
                </p>
              </div>
            )}

          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8 text-foreground">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.slice(0, 3).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function mapDrizzleProductToShop(d: any): Product {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  let urls: string[] = []
  if (d.image_id?.url) urls.push(d.image_id.url)
  if (Array.isArray(d.image_ids)) {
    for (const item of d.image_ids) {
      if (typeof item === 'string') {
        if (item.startsWith('http')) urls.push(item)
        else if (supabaseUrl && /^[0-9a-f-]{36}$/i.test(item))
          urls.push(`${supabaseUrl}/storage/v1/object/public/assets/${item}`)
      } else if (item?.url) urls.push(item.url)
    }
  } else if (typeof d.image_ids === 'string') {
    try {
      const parsed = JSON.parse(d.image_ids)
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (typeof item === 'string') {
            if (item.startsWith('http')) urls.push(item)
            else if (supabaseUrl && /^[0-9a-f-]{36}$/i.test(item))
              urls.push(`${supabaseUrl}/storage/v1/object/public/assets/${item}`)
          }
        }
      }
    } catch {}
  }
  return {
    id: d.id ?? '',
    name: d.name ?? '',
    slug: d.slug ?? '',
    description: d.description ?? '',
    price: parseFloat(String(d.price ?? '0')),
    original_price: d.original_price ? parseFloat(String(d.original_price)) : undefined,
    image_ids: urls,
    category: d.category_id ?? '',
    rating: parseFloat(String(d.rating ?? '0')),
    reviews: typeof d.reviews === 'number' ? d.reviews : parseInt(String(d.reviews ?? '0'), 10),
    stock: typeof d.stock === 'number' ? d.stock : parseInt(String(d.stock ?? '0'), 10),
    features: Array.isArray(d.features) ? d.features : [],
  }
}
