'use client'

import { useRouter } from 'next/navigation'
import type { ProductCategory } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/Base/Views'
import { categoryConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminCategoriesPage() {
  const router = useRouter()
  const { data: categories, loading, refresh } = useResource<ProductCategory[]>('/api/admin/categories')

  const openCreate = () => router.push('/admin/categories/new')

  const openEdit = (cat: ProductCategory) => router.push(`/admin/categories/${cat.id}/edit`)

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this category?')
    if (!ok) return

    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        refresh()
        showToast('success', 'Category deleted', 'The category was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'Failed to delete category.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'An error occurred while deleting.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: ProductCategory) => openEdit(rowData)

  const config = categoryConfig.listViewConfig(categories ?? [])

  return (
    <ResourceView
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
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    />
  )
}
