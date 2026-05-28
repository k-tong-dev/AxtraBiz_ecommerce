'use client'

import { useRouter } from 'next/navigation'
import type { Order } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/Base/Views'
import { orderConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminOrdersPage() {
  const router = useRouter()
  const { data: orders, loading, refresh } = useResource<Order[]>('/api/admin/orders')

  const openCreate = () => router.push('/admin/orders/new')

  const openEdit = (o: Order) => router.push(`/admin/orders/${o.id}/edit`)

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this order?')
    if (!ok) return

    try {
      const response = await fetch(`/api/admin/orders?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        refresh()
        showToast('success', 'Order deleted', 'The order was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'Failed to delete order.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'An error occurred while deleting.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: Order) => {
    openEdit(rowData)
  }

  const config = orderConfig.listViewConfig(orders ?? [])

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Orders',
        description: 'Create, edit, and manage customer orders.',
        listViewConfig: config,
        formViewConfig: orderConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: orderConfig.defaultActions,
        serverActions: orderConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    />
  )
}
