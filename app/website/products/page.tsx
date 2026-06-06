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
import { mockProducts } from '@/lib/mock/mock-data'
import type { Product } from '@/lib/types'
import { Search, ChevronDown, SlidersHorizontal, Filter, X, Sparkles } from 'lucide-react'

type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating' | 'popularity'

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const [products, setProducts] = useState<Product[]>(mockProducts)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/dashboard/products')
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

  const getCategoryCount = (category: string | null) => {
    if (category === null) return products.length
    return products.filter((p) => p.category === category).length
  }

  const sortLabels: Record<SortOption, string> = {
    newest: 'Newest Releases',
    'price-low': 'Price: Low to High',
    'price-high': 'Price: High to Low',
    rating: 'Highest Rated',
    popularity: 'Most Popular',
  }

  return (
    <div className="relative py-12 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-border/40 pb-8">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Store Catalog</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Premium <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Collections</span>
            </h1>
            <p className="text-sm text-muted-foreground max-w-md">
              Browse our complete catalog of handpicked premium goods designed for high-performance and style.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex md:hidden items-center justify-center gap-2 border border-border bg-card rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-muted/40 transition-all duration-300"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            {/* Sort Select */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-center gap-2 border border-border bg-card rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-muted/40 transition-all duration-300">
                  {sortLabels[sortBy]}
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl p-1 bg-card/95 backdrop-blur-md border border-border/60">
                {(Object.keys(sortLabels) as SortOption[]).map((opt) => (
                  <DropdownMenuItem
                    key={opt}
                    onClick={() => setSortBy(opt)}
                    className={`rounded-lg px-3 py-2 text-xs font-medium cursor-pointer ${
                      sortBy === opt ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-muted/50'
                    }`}
                  >
                    {sortLabels[opt]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6 sticky top-24 h-fit">
            <div className="glass-panel rounded-3xl p-6 space-y-6">
              
              {/* Search */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Search Products</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4.5 h-4.5" />
                  <Input
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-xl bg-background/50 border-border/60 text-sm focus:ring-primary h-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Categories</h3>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      selectedCategory === null
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span>All Products</span>
                    <span className="text-xs opacity-75 font-mono">({getCategoryCount(null)})</span>
                  </button>

                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span>{category}</span>
                      <span className="text-xs opacity-75 font-mono">({getCategoryCount(category)})</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* Mobile Filter Drawer Overlay */}
          {showMobileFilters && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setShowMobileFilters(false)}
              />
              <div className="relative w-full max-w-xs bg-background p-6 shadow-2xl flex flex-col gap-6 animate-slide-in-left">
                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                  <h2 className="text-lg font-bold">Catalog Filters</h2>
                  <button onClick={() => setShowMobileFilters(false)} className="p-1 rounded-lg hover:bg-muted">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Search */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4.5 h-4.5" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-xl bg-background"
                    />
                  </div>
                </div>

                {/* Mobile Categories */}
                <div className="space-y-2 flex-grow overflow-y-auto">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Categories</h3>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        setSelectedCategory(null)
                        setShowMobileFilters(false)
                      }}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        selectedCategory === null
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground'
                      }`}
                    >
                      <span>All Products</span>
                      <span className="text-xs font-mono">({getCategoryCount(null)})</span>
                    </button>

                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category)
                          setShowMobileFilters(false)
                        }}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          selectedCategory === category
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <span>{category}</span>
                        <span className="text-xs font-mono">({getCategoryCount(category)})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Catalog Grid Area */}
          <main className="lg:col-span-3 space-y-6">
            <p className="text-xs text-muted-foreground font-mono">
              SHOWING {filteredAndSortedProducts.length} PRODUCT{filteredAndSortedProducts.length !== 1 ? 'S' : ''}
            </p>

            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    className="opacity-0 translate-y-4 animate-fade-in"
                    style={{
                      animationPlayState: 'running',
                      animationDelay: `${idx % 6 * 80}ms`,
                      animationFillMode: 'forwards',
                      animationDuration: '0.5s',
                    }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border/80 rounded-3xl bg-muted/10">
                <p className="text-base font-bold mb-1">No products match your criteria</p>
                <p className="text-xs text-muted-foreground">Adjust filters or search query to find products.</p>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  )
}
