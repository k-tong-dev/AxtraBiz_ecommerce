'use client'

import { useRouter } from 'next/navigation'
import type { ProductAttributeValue } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/Base/Views'
import { productAttributeValueConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminProductAttributeValuesPage() {
  const router = useRouter()
  const { data: values, loading, refresh } = useResource<ProductAttributeValue[]>('/api/admin/product-attribute-values')

  const openCreate = () => router.push('/admin/product-attribute-values/new')

  const openEdit = (val: ProductAttributeValue) => router.push(`/admin/product-attribute-values/${val.id}/edit`)

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this attribute value?')
    if (!ok) return

    try {
      const response = await fetch(`/api/admin/product-attribute-values/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        refresh()
        showToast('success', 'Value deleted', 'The attribute value was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'Failed to delete attribute value.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'An error occurred while deleting.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: ProductAttributeValue) => {
    openEdit(rowData)
  }

  const config = productAttributeValueConfig.listViewConfig(values ?? [])

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Product Attribute Values',
        description: 'Create, edit, and manage product attribute values for your catalog.',
        listViewConfig: config,
        formViewConfig: productAttributeValueConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: productAttributeValueConfig.defaultActions,
        serverActions: productAttributeValueConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    />
  )
}
