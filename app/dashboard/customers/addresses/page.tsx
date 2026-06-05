'use client'

import { useRouter } from 'next/navigation'
import type { ResUserAddress } from '@/lib/drizzle/schema'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { addressConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminAddressesPage() {
  const router = useRouter()
  const { data: addresses, loading, refresh } = useResource<ResUserAddress[]>('/api/dashboard/addresses')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/dashboard/addresses', entityName: 'address', refresh, useQueryParam: true })

  const openCreate = () => router.push('/dashboard/customers/addresses/new')
  const openEdit = (row: ResUserAddress) => router.push(`/dashboard/customers/addresses/${row.id}/edit`)
  const handleRowClick = (rowData: ResUserAddress) => openEdit(rowData)

  const config = addressConfig.listViewConfig(addresses ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Addresses',
        description: 'Manage customer addresses.',
        listViewConfig: config,
        formViewConfig: addressConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: addressConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
