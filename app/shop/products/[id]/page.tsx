'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star, Minus, Plus, ArrowLeft } from 'lucide-react'
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
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/shop/products" className="flex items-center gap-2 text-primary hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Link>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="relative bg-muted aspect-square rounded-lg overflow-hidden">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === idx ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <Image src={img} alt={`${product.name} ${idx + 1}`} width={80} height={80} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            {/* Category */}
            <span className="text-sm font-semibold text-primary uppercase">{product.category}</span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.original_price && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.original_price.toFixed(2)}
                  </span>
                  <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    Save {discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-lg">{product.description}</p>

            {/* Features */}
            {product.features && (
              <div>
                <h3 className="font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-border rounded-lg bg-muted">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-background disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="flex-1 text-center font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="p-2 hover:bg-background disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => toggleWishlist(product.id)}
                className="gap-2"
              >
                <Heart
                  className={`w-5 h-5 ${isFavorited ? 'fill-destructive text-destructive' : ''}`}
                />
              </Button>
            </div>

            {/* Shipping Info */}
            <div className="border-t border-b border-border py-4 space-y-2 text-sm">
              <p>
                <span className="font-semibold">Free Shipping:</span> On orders over $100
              </p>
              <p>
                <span className="font-semibold">Returns:</span> 30-day money-back guarantee
              </p>
              <p>
                <span className="font-semibold">Warranty:</span> 1-year manufacturer warranty
              </p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
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
