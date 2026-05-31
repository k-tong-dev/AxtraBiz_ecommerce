'use client'

import { currencyConfig } from '../config'
import { ResourceView } from '@/components/Base/Views'

export default function NewCurrencyPage() {
  return (
    <ResourceView
      config={{
        type: 'form',
        title: 'New Currency',
        formViewConfig: currencyConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: currencyConfig.defaultActions,
      }}
      initialData={{}}
    />
  )
}
