'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import type { ProductTemplate } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '../../../components/Base/Views'
import { productConfig } from './config'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<ProductTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    ;(async () => {
      try {
        const response = await fetch('/api/admin/products')
        const allProducts = await response.json()
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
        showToast('error', 'Error', 'Failed to load products')
        setLoading(false)
      }
    })()
  }, [])

  const openCreate = () => {
    router.push('/admin/products/new')
  }

  const openEdit = (p: ProductTemplate) => {
    router.push(`/admin/products/${p.id}/edit`)
  }

  const remove = async (id: number) => {
    const ok = window.confirm('Delete this product?')
    if (!ok) return

    try {
      setProducts((prev) => prev.filter((p) => p.id !== id))
      const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
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

  const handleRowClick = (rowData: ProductTemplate) => {
    openEdit(rowData)
  }

  const handleDelete = (product: ProductTemplate) => {
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

