'use client'

import { useRouter } from 'next/navigation'
import type { Order } from '@/lib/drizzle/schema'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { orderConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminOrdersPage() {
  const router = useRouter()
  const { data: orders, loading, refresh } = useResource<Order[]>('/api/dashboard/orders')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/dashboard/orders', entityName: 'order', refresh, useQueryParam: true })

  const openCreate = () => router.push('/dashboard/sales/orders/new')

  const openEdit = (o: Order) => router.push(`/dashboard/sales/orders/${o.id}/edit`)

  const handleRowClick = (rowData: Order) => {
    openEdit(rowData)
  }

  const config = orderConfig.listViewConfig(orders ?? [])

  return (
    <>{deleteModal}<ResourceView
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
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
