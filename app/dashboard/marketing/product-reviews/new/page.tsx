'use client'

import { productReviewConfig } from '../config'
import { ResourceView } from '@/components/Base/Views'

export default function NewProductReviewPage() {
  return (
    <ResourceView
      config={{
        type: 'form',
        title: 'New Product Review',
        formViewConfig: productReviewConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: productReviewConfig.defaultActions,
      }}
      initialData={{}}
    />
  )
}
