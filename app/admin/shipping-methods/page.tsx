'use client'

import { useRouter } from 'next/navigation'
import type { ShippingMethod } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { shippingMethodConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminShippingMethodsPage() {
  const router = useRouter()
  const { data: shippingMethods, loading, refresh } = useResource<ShippingMethod[]>('/api/admin/shipping-methods')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/shipping-methods', entityName: 'shipping method', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/shipping-methods/new')
  const openEdit = (row: ShippingMethod) => router.push(`/admin/shipping-methods/${row.id}/edit`)
  const handleRowClick = (rowData: ShippingMethod) => openEdit(rowData)

  const config = shippingMethodConfig.listViewConfig(shippingMethods ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Shipping Methods',
        description: 'Configure shipping rates and delivery options.',
        listViewConfig: config,
        formViewConfig: shippingMethodConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: shippingMethodConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
