'use client'

import { useRouter } from 'next/navigation'
import type { ProductTemplate } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/Base/Views'
import { productConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminProductsPage() {
  const router = useRouter()
  const { data: products, loading, refresh } = useResource<ProductTemplate[]>('/api/admin/products')

  const openCreate = () => router.push('/admin/products/new')

  const openEdit = (p: ProductTemplate) => router.push(`/admin/products/${p.id}/edit`)

  const remove = async (id: number) => {
    const ok = window.confirm('Delete this product?')
    if (!ok) return

    try {
      const response = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        refresh()
        showToast('success', 'Product deleted', 'The product was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'Failed to delete product.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'An error occurred while deleting.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: ProductTemplate) => {
    openEdit(rowData)
  }

  const handleDelete = (product: ProductTemplate) => {
    remove(product.id)
  }

  const config = productConfig.listViewConfig(products ?? [])

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Products',
        description: 'Create, edit, and manage your product catalog.',
        listViewConfig: config,
        kanbanViewConfig: productConfig.kanbanViewConfig(products ?? []),
        formViewConfig: productConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: productConfig.defaultActions,
        serverActions: productConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    />
  )
}
