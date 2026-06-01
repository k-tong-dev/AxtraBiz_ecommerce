'use client'

import { shopConfig } from '../config'
import { ResourceView } from '@/components/Base/Views'

export default function NewShopPage() {
  return (
    <ResourceView
      config={{
        type: 'form',
        title: 'New Shop',
        formViewConfig: shopConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: shopConfig.defaultActions,
      }}
      initialData={{}}
    />
  )
}
