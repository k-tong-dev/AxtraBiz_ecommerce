'use client'

import { useRouter } from 'next/navigation'
import type { ProductTemplate } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { productConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'
import { useConfirmDelete } from '@/lib/hooks/useConfirmDelete'

export default function AdminProductsPage() {
  const router = useRouter()
  const { data: products, loading, refresh } = useResource<ProductTemplate[]>('/api/admin/products')
  const { confirmDelete, deleteModal } = useConfirmDelete({
    apiEndpoint: '/api/admin/products',
    entityName: 'product',
    refresh,
  })

  const openCreate = () => router.push('/admin/products/new')

  const openEdit = (p: ProductTemplate) => router.push(`/admin/products/${p.id}/edit`)

  const handleRowClick = (rowData: ProductTemplate) => {
    openEdit(rowData)
  }

  const config = productConfig.listViewConfig(products ?? [])

  return (
    <>
      {deleteModal}
      <ResourceView
        config={{
          type: 'kanban',
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
        onDelete={(rowData) => confirmDelete(rowData.id)}
        onCreate={openCreate}
        loading={loading}
        onRefresh={refresh}
      />
    </>
  )
}
