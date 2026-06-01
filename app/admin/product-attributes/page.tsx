'use client'

import { useRouter } from 'next/navigation'
import type { ProductAttribute } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { productAttributeConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminProductAttributesPage() {
  const router = useRouter()
  const { data: attributes, loading, refresh } = useResource<ProductAttribute[]>('/api/admin/product-attributes')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/product-attributes', entityName: 'attribute', refresh, useQueryParam: false })

  const openCreate = () => router.push('/admin/product-attributes/new')

  const openEdit = (attr: ProductAttribute) => router.push(`/admin/product-attributes/${attr.id}/edit`)

  const handleRowClick = (rowData: ProductAttribute) => {
    openEdit(rowData)
  }

  const config = productAttributeConfig.listViewConfig(attributes ?? [])

  return (
    <>{deleteModal}<ResourceView
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
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
