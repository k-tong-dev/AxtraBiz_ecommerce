'use client'

import { useRouter } from 'next/navigation'
import type { User } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/lib/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { customerConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminCustomersPage() {
  const router = useRouter()
  const { data: customers, loading, refresh } = useResource<User[]>('/api/admin/users')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/users', entityName: 'customer', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/customers/new')

  const openEdit = (u: User) => router.push(`/admin/customers/${u.id}/edit`)

  const handleRowClick = (rowData: User) => {
    openEdit(rowData)
  }

  const config = customerConfig.listViewConfig(customers ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Customers',
        description: 'Create, edit, and manage customer accounts.',
        listViewConfig: config,
        formViewConfig: customerConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: customerConfig.defaultActions,
        serverActions: customerConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
