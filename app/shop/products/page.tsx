'use client'

import { useEffect, useMemo, useState } from 'react'
import { ProductCard } from '@/components/storefront/product-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { mockProducts } from '@/lib/mock-data'
import type { Product } from '@/lib/types'
import { Search, ChevronDown } from 'lucide-react'

type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating' | 'popularity'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('newest')

  const [products, setProducts] = useState<Product[]>(mockProducts)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/products')
        if (!res.ok) {
          console.error('[ShopProducts] API error:', res.status)
          return
        }
        const data = await res.json()
        console.log('[ShopProducts] Fetched', data.length, 'products from Drizzle')
        if (!mounted) return
        if (data && data.length > 0) {
          setProducts(data.map(mapDrizzleProductToShop))
        }
      } catch (err) {
        console.error('[ShopProducts] Fetch failed:', err)
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  const categories = [...new Set(products.map((p) => p.category))]

  const filteredAndSortedProducts = useMemo(() => {
    let result = products

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // Sort
    const sorted = [...result]
    switch (sortBy) {
      case 'price-low':
        sorted.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        sorted.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        sorted.sort((a, b) => b.rating - a.rating)
        break
      case 'popularity':
        sorted.sort((a, b) => b.reviews - a.reviews)
        break
      default:
        // newest - keep original order
        break
    }

    return sorted
  }, [products, searchQuery, selectedCategory, sortBy])

// Maps Drizzle ProductTemplate to shop Product type (lib/types.ts)
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

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Shop Products</h1>
          <p className="text-muted-foreground">Browse our complete collection of premium items</p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-6 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(null)}
                size="sm"
              >
                All Products
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Sort */}
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Sort by <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortBy('newest')}>Newest</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price-low')}>
                    Price: Low to High
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('price-high')}>
                    Price: High to Low
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('rating')}>Highest Rated</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('popularity')}>
                    Most Popular
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <p className="text-sm text-muted-foreground mb-6">
          Showing {filteredAndSortedProducts.length} product
          {filteredAndSortedProducts.length !== 1 ? 's' : ''}
        </p>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg font-semibold mb-2">No products found</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
