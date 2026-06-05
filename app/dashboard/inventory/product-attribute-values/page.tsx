'use client'

import { useRouter } from 'next/navigation'
import type { ProductAttributeValue } from '@/lib/drizzle/schema'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { productAttributeValueConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminProductAttributeValuesPage() {
  const router = useRouter()
  const { data: values, loading, refresh } = useResource<ProductAttributeValue[]>('/api/dashboard/product-attribute-values')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/dashboard/product-attribute-values', entityName: 'attribute value', refresh, useQueryParam: false })

  const openCreate = () => router.push('/dashboard/inventory/product-attribute-values/new')

  const openEdit = (val: ProductAttributeValue) => router.push(`/dashboard/inventory/product-attribute-values/${val.id}/edit`)

  const handleRowClick = (rowData: ProductAttributeValue) => {
    openEdit(rowData)
  }

  const config = productAttributeValueConfig.listViewConfig(values ?? [])

  return (
    <>{deleteModal}<ResourceView
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
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
