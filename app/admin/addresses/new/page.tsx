'use client'

import { addressConfig } from '../config'
import { ResourceView } from '@/components/Base/Views'

export default function NewAddressPage() {
  return (
    <ResourceView
      config={{
        type: 'form',
        title: 'New Address',
        formViewConfig: addressConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: addressConfig.defaultActions,
      }}
      initialData={{}}
    />
  )
}
