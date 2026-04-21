'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Product } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ListView } from '@/components/admin/ListView'
import { getProductListConfig } from '@/components/admin/list-configs/productListConfig'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const response = await fetch('/api/products')
        const allProducts = await response.json()
        if (!mounted) return
        setProducts(allProducts)
        setLoading(false)
        if (allProducts.length === 0) {
          showToast(
            'info',
            'No products found',
            'Your products table is empty. Add some sample data or create your first product.',
          )
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        if (!mounted) return
        showToast('error', 'Error', 'Failed to load products')
        setLoading(false)
      }
    })()
    return () => {
      mounted = false
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

    try {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        showToast('success', 'Product deleted', 'The product was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'The product was removed from the UI, but delete did not succeed.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'The product was removed from the UI, but delete did not succeed.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: Product) => {
    openEdit(rowData)
  }

  const config = getProductListConfig(products)

  return (
    <Card className="mx-auto max-w-7xl border-border/50">
      <div className="flex items-center justify-between gap-4 px-6 pt-6">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Create, edit, and manage your product catalog.</p>
        </div>
        <Button onClick={openCreate} size="sm" className="shadow-sm">
          Add Product
        </Button>
      </div>

      <div className="p-6 pt-0">
        <ListView 
          config={config} 
          onRowClick={handleRowClick}
          onDelete={(rowData) => remove(rowData.id)}
          loading={loading}
        />
      </div>
    </Card>
  )
}

