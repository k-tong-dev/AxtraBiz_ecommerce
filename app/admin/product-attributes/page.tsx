'use client'

import { useRouter } from 'next/navigation'
import type { ProductAttribute } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/Base/Views'
import { productAttributeConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminProductAttributesPage() {
  const router = useRouter()
  const { data: attributes, loading, refresh } = useResource<ProductAttribute[]>('/api/admin/product-attributes')

  const openCreate = () => router.push('/admin/product-attributes/new')

  const openEdit = (attr: ProductAttribute) => router.push(`/admin/product-attributes/${attr.id}/edit`)

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this attribute?')
    if (!ok) return

    try {
      const response = await fetch(`/api/admin/product-attributes/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        refresh()
        showToast('success', 'Attribute deleted', 'The attribute was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'Failed to delete attribute.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'An error occurred while deleting.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: ProductAttribute) => {
    openEdit(rowData)
  }

  const config = productAttributeConfig.listViewConfig(attributes ?? [])

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Product Attributes',
        description: 'Create, edit, and manage product attributes for your catalog.',
        listViewConfig: config,
        formViewConfig: productAttributeConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: productAttributeConfig.defaultActions,
        serverActions: productAttributeConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    />
  )
}
