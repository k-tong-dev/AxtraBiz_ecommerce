'use client'

import { useRouter } from 'next/navigation'
import type { Address } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { addressConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminAddressesPage() {
  const router = useRouter()
  const { data: addresses, loading, refresh } = useResource<Address[]>('/api/admin/addresses')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/addresses', entityName: 'address', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/customers/addresses/new')
  const openEdit = (row: Address) => router.push(`/admin/customers/addresses/${row.id}/edit`)
  const handleRowClick = (rowData: Address) => openEdit(rowData)

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
