'use client'

import { taxRateConfig } from '../config'
import { ResourceView } from '@/components/Base/Views'

export default function NewTaxRatePage() {
  return (
    <ResourceView
      config={{
        type: 'form',
        title: 'New Tax Rate',
        formViewConfig: taxRateConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: taxRateConfig.defaultActions,
      }}
      initialData={{}}
    />
  )
}
