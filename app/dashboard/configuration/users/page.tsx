'use client'

import { useRouter } from 'next/navigation'
import type { User } from '@/lib/drizzle/schema'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { staffConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminStaffPage() {
  const router = useRouter()
  const { data: staff, loading, refresh } = useResource<User[]>('/api/dashboard/staff-accounts')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/dashboard/staff-accounts', entityName: 'user', refresh, useQueryParam: true })

  const openCreate = () => router.push('/dashboard/configuration/users/new')
  const openEdit = (row: User) => router.push(`/dashboard/configuration/users/${row.id}/edit`)
  const handleRowClick = (rowData: User) => openEdit(rowData)

  const config = staffConfig.listViewConfig(staff ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Users',
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
