'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import type { Product } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/admin/ResourceView'
import { productConfig } from './config'

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

  const handleDelete = (product: Product) => {
    remove(product.id)
  }

  const config = productConfig.listViewConfig(products)

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Products',
        description: 'Create, edit, and manage your product catalog.',
        listViewConfig: config,
        kanbanViewConfig: productConfig.kanbanViewConfig(products),
        formViewConfig: productConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: productConfig.defaultActions,
        serverActions: productConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
    />
  )
}

