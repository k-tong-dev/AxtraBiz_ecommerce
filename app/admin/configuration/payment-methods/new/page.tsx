'use client'

import { paymentMethodConfig } from '../config'
import { ResourceView } from '@/components/Base/Views'

export default function NewPaymentMethodPage() {
  return (
    <ResourceView
      config={{
        type: 'form',
        title: 'New Payment Method',
        formViewConfig: paymentMethodConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: paymentMethodConfig.defaultActions,
      }}
      initialData={{}}
    />
  )
}
