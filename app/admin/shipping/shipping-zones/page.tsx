'use client'

import { useRouter } from 'next/navigation'
import type { ShippingZone } from '@/lib/drizzle/server'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'
import { ResourceView } from '@/components/Base/Views'
import { shippingZoneConfig } from './config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function AdminShippingZonesPage() {
  const router = useRouter()
  const { data: zones, loading, refresh } = useResource<ShippingZone[]>('/api/admin/shipping-zones')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/shipping-zones', entityName: 'shipping zone', refresh, useQueryParam: true })

  const openCreate = () => router.push('/admin/shipping/shipping-zones/new')
  const openEdit = (row: ShippingZone) => router.push(`/admin/shipping/shipping-zones/${row.id}/edit`)
  const handleRowClick = (rowData: ShippingZone) => openEdit(rowData)

  const config = shippingZoneConfig.listViewConfig(zones ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Shipping Zones',
        description: 'Define shipping zones by country and region.',
        listViewConfig: config,
        formViewConfig: shippingZoneConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: shippingZoneConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
