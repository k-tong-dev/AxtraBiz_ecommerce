'use client'

import { staffConfig } from '../config'
import { ResourceView } from '@/components/Base/Views'

export default function NewStaffPage() {
  return (
    <ResourceView
      config={{
        type: 'form',
        title: 'New Users',
        formViewConfig: staffConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: staffConfig.defaultActions,
      }}
      initialData={{}}
    />
  )
}
