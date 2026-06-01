'use client'

import { shippingZoneConfig } from '../config'
import { ResourceView } from '@/components/Base/Views'

export default function NewShippingZonePage() {
  return (
    <ResourceView
      config={{
        type: 'form',
        title: 'New Shipping Zone',
        formViewConfig: shippingZoneConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: shippingZoneConfig.defaultActions,
      }}
      initialData={{}}
    />
  )
}
