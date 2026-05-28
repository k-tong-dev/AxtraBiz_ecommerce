'use client'

import { useRouter } from 'next/navigation'
import type { User } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/Base/Views'
import { customerConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminCustomersPage() {
  const router = useRouter()
  const { data: customers, loading, refresh } = useResource<User[]>('/api/admin/users')

  const openCreate = () => router.push('/admin/customers/new')

  const openEdit = (u: User) => router.push(`/admin/customers/${u.id}/edit`)

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this customer?')
    if (!ok) return

    try {
      const response = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        refresh()
        showToast('success', 'Customer deleted', 'The customer was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'Failed to delete customer.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'An error occurred while deleting.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: User) => {
    openEdit(rowData)
  }

  const config = customerConfig.listViewConfig(customers ?? [])

  return (
    <ResourceView
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
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    />
  )
}
