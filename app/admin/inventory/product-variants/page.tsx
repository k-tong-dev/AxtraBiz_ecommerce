'use client'

import { useRouter } from 'next/navigation'
import type { ProductVariant } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { productVariantConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminProductVariantsPage() {
  const router = useRouter()
  const { data: variants, loading, refresh } = useResource<ProductVariant[]>('/api/admin/inventory/product-variants')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/inventory/product-variants', entityName: 'product variant', refresh, useQueryParam: false })

  const openCreate = () => router.push('/admin/inventory/product-variants/new')

  const openEdit = (v: ProductVariant) => router.push(`/admin/inventory/product-variants/${v.id}/edit`)

  const handleRowClick = (rowData: ProductVariant) => {
    openEdit(rowData)
  }

  const config = productVariantConfig.listViewConfig(variants ?? [])

  return (
    <>{deleteModal}<ResourceView
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
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
