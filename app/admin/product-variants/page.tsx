'use client'

import { useRouter } from 'next/navigation'
import type { ProductVariant } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/Base/Views'
import { productVariantConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminProductVariantsPage() {
  const router = useRouter()
  const { data: variants, loading, refresh } = useResource<ProductVariant[]>('/api/admin/product-variants')

  const openCreate = () => router.push('/admin/product-variants/new')

  const openEdit = (v: ProductVariant) => router.push(`/admin/product-variants/${v.id}/edit`)

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this product variant?')
    if (!ok) return

    try {
      const response = await fetch(`/api/admin/product-variants/${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        refresh()
        showToast('success', 'Variant deleted', 'The product variant was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'Failed to delete variant.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'An error occurred while deleting.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: ProductVariant) => {
    openEdit(rowData)
  }

  const config = productVariantConfig.listViewConfig(variants ?? [])

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Product Variants',
        description: 'Create, edit, and manage product variants.',
        listViewConfig: config,
        formViewConfig: productVariantConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: productVariantConfig.defaultActions,
        serverActions: productVariantConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    />
  )
}
