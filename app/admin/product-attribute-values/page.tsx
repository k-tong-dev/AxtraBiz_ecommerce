'use client'

import { useRouter } from 'next/navigation'
import type { ProductAttributeValue } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/lib/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { productAttributeValueConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminProductAttributeValuesPage() {
  const router = useRouter()
  const { data: values, loading, refresh } = useResource<ProductAttributeValue[]>('/api/admin/product-attribute-values')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/product-attribute-values', entityName: 'attribute value', refresh, useQueryParam: false })

  const openCreate = () => router.push('/admin/product-attribute-values/new')

  const openEdit = (val: ProductAttributeValue) => router.push(`/admin/product-attribute-values/${val.id}/edit`)

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
