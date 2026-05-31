'use client'

import { useParams } from 'next/navigation'
import type { ShippingMethod } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { shippingMethodConfig } from '../../config'
import { useResource } from '@/lib/hooks/useResource'

export default function EditShippingMethodPage() {
  const params = useParams()
  const id = params.id as string
  const { data: shippingMethod, loading } = useResource<ShippingMethod>(`/api/admin/shipping-methods/${id}`)

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${shippingMethod?.name || 'Edit Shipping Method'}`,
        formViewConfig: shippingMethodConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: shippingMethodConfig.defaultActions,
      }}
      initialData={shippingMethod}
      entityId={id}
    />
  )
}
