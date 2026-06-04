'use client'

import { shippingMethodConfig } from '../config'
import { ResourceView } from '@/components/Base/Views'

export default function NewShippingMethodPage() {
  return (
    <ResourceView
      config={{
        type: 'form',
        title: 'New Shipping Method',
        formViewConfig: shippingMethodConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: shippingMethodConfig.defaultActions,
      }}
      initialData={{}}
    />
  )
}
