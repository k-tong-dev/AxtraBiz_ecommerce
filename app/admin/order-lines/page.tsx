'use client'

import { useRouter } from 'next/navigation'
import type { OrderLine } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/lib/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { orderLineConfig } from './config'
import { useResource } from '@/lib/hooks/useResource'

export default function AdminOrderLinesPage() {
  const router = useRouter()
  const { data: items, loading, refresh } = useResource<OrderLine[]>('/api/admin/order-lines')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/order-lines', entityName: 'order line', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/order-lines/new')

  const openEdit = (item: OrderLine) => router.push(`/admin/order-lines/${item.id}/edit`)

  const handleRowClick = (rowData: OrderLine) => {
    openEdit(rowData)
  }

  const config = orderLineConfig.listViewConfig(items ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Order Lines',
        description: 'View and manage order line items.',
        listViewConfig: config,
        formViewConfig: orderLineConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: orderLineConfig.defaultActions,
        serverActions: orderLineConfig.customServerActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
