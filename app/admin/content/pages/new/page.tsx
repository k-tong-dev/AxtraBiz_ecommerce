'use client'

import { pageConfig } from '../config'
import { ResourceView } from '@/components/Base/Views'

export default function NewPagePage() {
  return (
    <ResourceView
      config={{
        type: 'form',
        title: 'New Page',
        formViewConfig: pageConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: pageConfig.defaultActions,
      }}
      initialData={{}}
    />
  )
}
