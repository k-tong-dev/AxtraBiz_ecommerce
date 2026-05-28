'use client'

import { useRouter } from 'next/navigation'
import type { Brand } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/Base/Views'
import { brandConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminBrandsPage() {
  const router = useRouter()
  const { data: brands, loading, refresh } = useResource<Brand[]>('/api/admin/brands')

  const openCreate = () => router.push('/admin/brands/new')

  const openEdit = (brand: Brand) => router.push(`/admin/brands/${brand.id}/edit`)

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this brand?')
    if (!ok) return

    try {
      const response = await fetch(`/api/admin/brands?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        refresh()
        showToast('success', 'Brand deleted', 'The brand was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'Failed to delete brand.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'An error occurred while deleting.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: Brand) => openEdit(rowData)

  const config = brandConfig.listViewConfig(brands ?? [])

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Brands',
        description: 'Create, edit, and manage product brands.',
        listViewConfig: config,
        formViewConfig: brandConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: brandConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    />
  )
}
