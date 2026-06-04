'use client'

import { ResourceView } from '@/components/Base/Views'
import { categoryConfig } from '../config'

export default function NewCategoryPage() {
  return (
    <ResourceView
      config={{
        type: 'form',
        title: 'New Category',
        description: 'Create a new product category.',
        formViewConfig: categoryConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: categoryConfig.defaultActions,
      }}
    />
  )
}
