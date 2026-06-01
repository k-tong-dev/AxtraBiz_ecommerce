'use client'

import { useRouter } from 'next/navigation'
import type { Brand } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { brandConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminBrandsPage() {
  const router = useRouter()
  const { data: brands, loading, refresh } = useResource<Brand[]>('/api/admin/brands')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/brands', entityName: 'brand', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/brands/new')

  const openEdit = (brand: Brand) => router.push(`/admin/brands/${brand.id}/edit`)

  const handleRowClick = (rowData: Brand) => openEdit(rowData)

  const config = brandConfig.listViewConfig(brands ?? [])

  return (
    <>{deleteModal}<ResourceView
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
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
