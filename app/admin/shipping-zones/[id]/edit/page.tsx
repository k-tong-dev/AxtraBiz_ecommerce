'use client'

import { useParams } from 'next/navigation'
import type { ShippingZone } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { shippingZoneConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditShippingZonePage() {
  const params = useParams()
  const id = params.id as string
  const { data: zone, loading } = useResource<ShippingZone>(`/api/admin/shipping-zones/${id}`)

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${zone?.name || 'Edit Shipping Zone'}`,
        formViewConfig: shippingZoneConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: shippingZoneConfig.defaultActions,
      }}
      initialData={zone}
      entityId={id}
    />
  )
}
