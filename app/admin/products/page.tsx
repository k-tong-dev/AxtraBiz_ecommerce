'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import type { Product } from '@/lib/types'
import { fetchProductsFromSupabase, deleteProductFromSupabase } from '@/lib/supabase/products'
import { showToast } from '@/lib/ui/toast'

function stringToNumberOrZero(value: string) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'rating'>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const allProducts = await fetchProductsFromSupabase()
      console.log(allProducts)
      if (!mounted) return
      setProducts(allProducts)
      setLoading(false)
      if (allProducts.length === 0) {
        showToast(
          'info',
          'No products found',
          'Your Supabase `products` table is empty. Add some sample data or create your first product.',
        )
      }
    })()
    return () => {
      mounted = false
    }
  }, [])

  // Refresh products when page gains focus (user navigates back from create/edit)
  useEffect(() => {
    const handleFocus = () => {
      fetchProductsFromSupabase().then(rows => {
        setProducts(rows)
        setLoading(false)
      })
    }

    // Listen for focus events
    document.addEventListener('visibilitychange', handleFocus)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleFocus)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const openCreate = () => {
    router.push('/admin/products/new')
  }

  const openEdit = (p: Product) => {
    router.push(`/admin/products/${p.id}/edit`)
  }


  const remove = async (id: string) => {
    const ok = window.confirm('Delete this product?')
    if (!ok) return

    setProducts((prev) => prev.filter((p) => p.id !== id))
    const success = await deleteProductFromSupabase(id)
    if (!success) {
      showToast('error', 'Delete failed', 'The product was removed from the UI, but Drizzle delete did not succeed.')
    } else {
      showToast('success', 'Product deleted', 'The product was removed successfully.')
    }
  }

  const removeSelected = async () => {
    if (!selectedIds.length) return
    const ok = window.confirm(`Delete ${selectedIds.length} selected products?`)
    if (!ok) return

    setProducts((prev) => prev.filter((p) => !selectedIds.includes(p.id)))
    const ids = [...selectedIds]
    setSelectedIds([])
    await Promise.all(ids.map((id) => deleteProductFromSupabase(id)))
    showToast('success', 'Products deleted', `${ids.length} product(s) were removed.`)
  }

  const title = useMemo(() => {
    return loading ? 'Products (loading...)' : 'Products'
  }, [loading])

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filteredByCategory =
      categoryFilter === 'all'
        ? products
        : products.filter((p) => p.category.toLowerCase() === categoryFilter.toLowerCase())

    if (!query) return filteredByCategory
    return filteredByCategory.filter((p) =>
      [p.id, p.name, p.category, p.description].some((value) =>
        value?.toLowerCase().includes(query),
      ),
    )
  }, [products, search, categoryFilter])

  const categories = useMemo(() => {
    const values = Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
    return values.sort((a, b) => a.localeCompare(b))
  }, [products])

  const sortedProducts = useMemo(() => {
    const copy = [...filteredProducts]
    copy.sort((a, b) => {
      const direction = sortDir === 'asc' ? 1 : -1
      switch (sortBy) {
        case 'price':
          return (a.price - b.price) * direction
        case 'stock':
          return (a.stock - b.stock) * direction
        case 'rating':
          return (a.rating - b.rating) * direction
        default:
          return a.name.localeCompare(b.name) * direction
      }
    })
    return copy
  }, [filteredProducts, sortBy, sortDir])

  const pageSize = 8
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / pageSize))
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedProducts.slice(start, start + pageSize)
  }, [page, sortedProducts])

  const allPageSelected =
    paginatedProducts.length > 0 &&
    paginatedProducts.every((product) => selectedIds.includes(product.id))

  const toggleSort = (key: typeof sortBy) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortDir('asc')
    }
  }

  const renderSortIcon = (key: typeof sortBy) => {
    if (sortBy !== key) return null
    return sortDir === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  return (
    <Card className="mx-auto max-w-7xl border-border/50">
      <div className="flex items-center justify-between gap-4 px-6 pt-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">Create, edit, and manage your product catalog.</p>
        </div>
        <Button onClick={openCreate} size="sm" className="shadow-sm">
          Add Product
        </Button>
      </div>

      <div className="p-6 pt-0 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search products..."
              className="pl-9 border-border/50 focus:border-primary transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              className="h-9 rounded-md border border-border bg-background px-3 text-sm font-medium hover:bg-muted/50 transition-colors"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value)
                setPage(1)
              }}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              onClick={() => toggleSort('price')}
              className="gap-1"
            >
              Price {renderSortIcon('price')}
            </Button>
            <Button
              size="sm"
              onClick={removeSelected}
              disabled={!selectedIds.length}
            >
              Delete Selected
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50">
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds((prev) => Array.from(new Set([...prev, ...paginatedProducts.map((p) => p.id)])))
                    } else {
                      setSelectedIds((prev) => prev.filter((id) => !paginatedProducts.some((p) => p.id === id)))
                    }
                  }}
                  className="rounded border-border"
                />
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">ID</TableHead>
              <TableHead>
                <button type="button" onClick={() => toggleSort('name')} className="inline-flex items-center gap-1 hover:text-foreground font-semibold">
                  Name {renderSortIcon('name')}
                </button>
              </TableHead>
              <TableHead className="font-semibold text-muted-foreground">Category</TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground">
                <button type="button" onClick={() => toggleSort('price')} className="inline-flex items-center gap-1 hover:text-foreground">
                  Price {renderSortIcon('price')}
                </button>
              </TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground">
                <button type="button" onClick={() => toggleSort('stock')} className="inline-flex items-center gap-1 hover:text-foreground">
                  Stock {renderSortIcon('stock')}
                </button>
              </TableHead>
              <TableHead className="text-right font-semibold text-muted-foreground">
                <button type="button" onClick={() => toggleSort('rating')} className="inline-flex items-center gap-1 hover:text-foreground">
                  Rating {renderSortIcon('rating')}
                </button>
              </TableHead>
              <TableHead className="w-[180px] font-semibold text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((p) => (
              <TableRow key={p.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(p.id)}
                    onChange={(e) => {
                      setSelectedIds((prev) =>
                        e.target.checked ? [...prev, p.id] : prev.filter((id) => id !== p.id),
                      )
                    }}
                    className="rounded border-border"
                  />
                </TableCell>
                <TableCell className="max-w-[140px] truncate font-mono text-xs">{p.id}</TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    {p.image && (
                      <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-cover" />
                    )}
                    <span>{p.name || '—'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium">
                    {p.category}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">${p.price.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    p.stock > 10 ? 'bg-green-100 text-green-800' : 
                    p.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {p.stock}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{p.rating.toFixed(1)}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-1 h-1 rounded-full ${
                            i < Math.floor(p.rating) ? 'bg-yellow-400' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" onClick={() => openEdit(p)} className="hover:bg-accent">
                      Edit
                    </Button>
                    <Button size="sm" onClick={() => remove(p.id)} className="hover:bg-destructive/90">
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {paginatedProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-muted-foreground text-center py-16">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium">No products found</p>
                    <p className="text-sm text-muted-foreground">
                      {search.trim() ? 'Try adjusting your search terms' : 'Create your first product to get started'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="text-muted-foreground/70">
              Showing <span className="font-medium">{paginatedProducts.length}</span> of <span className="font-medium">{sortedProducts.length}</span> products
            </div>
            <div className="flex items-center gap-1">
              <Button 
                size="sm" 
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="hover:bg-accent transition-colors"
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                <span className="px-3 py-1 text-sm font-medium bg-muted rounded-md">
                  Page {page} / {totalPages}
                </span>
              </div>
              <Button
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="hover:bg-accent transition-colors"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

    </Card>
  )
}

