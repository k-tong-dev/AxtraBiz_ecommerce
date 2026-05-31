'use client'

import { useRouter } from 'next/navigation'
import type { ProductCategory } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/lib/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { categoryConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminCategoriesPage() {
  const router = useRouter()
  const { data: categories, loading, refresh } = useResource<ProductCategory[]>('/api/admin/categories')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/categories', entityName: 'category', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/categories/new')

  const openEdit = (cat: ProductCategory) => router.push(`/admin/categories/${cat.id}/edit`)

  const handleRowClick = (rowData: ProductCategory) => openEdit(rowData)

  const config = categoryConfig.listViewConfig(categories ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Categories',
        description: 'Create, edit, and manage product categories.',
        listViewConfig: config,
        formViewConfig: categoryConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: categoryConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
