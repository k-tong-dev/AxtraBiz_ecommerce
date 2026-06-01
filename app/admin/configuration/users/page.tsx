'use client'

import { useRouter } from 'next/navigation'
import type { StaffAccount } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { staffConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminStaffPage() {
  const router = useRouter()
  const { data: staff, loading, refresh } = useResource<StaffAccount[]>('/api/admin/staff-accounts')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/staff-accounts', entityName: 'staff account', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/configuration/users/new')
  const openEdit = (row: StaffAccount) => router.push(`/admin/configuration/users/${row.id}/edit`)
  const handleRowClick = (rowData: StaffAccount) => openEdit(rowData)

  const config = staffConfig.listViewConfig(staff ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Staff Accounts',
        description: 'Manage staff accounts and their access.',
        listViewConfig: config,
        formViewConfig: staffConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: staffConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
