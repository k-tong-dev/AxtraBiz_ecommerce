'use client'

import { brandConfig } from '../config'
import { ResourceView } from '@/components/Base/Views'

export default function NewBrandPage() {
  return (
    <ResourceView
      config={{
        type: 'form',
        title: 'New Brand',
        formViewConfig: brandConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: brandConfig.defaultActions,
      }}
      initialData={{}}
    />
  )
}
