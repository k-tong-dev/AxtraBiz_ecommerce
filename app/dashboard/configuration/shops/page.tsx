'use client'

import { useRouter } from 'next/navigation'
import type { Shop } from '@/lib/drizzle/schema'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { shopConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminShopsPage() {
  const router = useRouter()
  const { data: shops, loading, refresh } = useResource<Shop[]>('/api/dashboard/shops')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/dashboard/shops', entityName: 'shop', refresh, useQueryParam: true })

  const openCreate = () => router.push('/dashboard/configuration/shops/new')
  const openEdit = (row: Shop) => router.push(`/dashboard/configuration/shops/${row.id}/edit`)
  const handleRowClick = (rowData: Shop) => openEdit(rowData)

  const config = shopConfig.listViewConfig(shops ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Shops',
        description: 'Create, edit, and manage your shops.',
        listViewConfig: config,
        formViewConfig: shopConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: shopConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
