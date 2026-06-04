'use client'

import { useParams } from 'next/navigation'
import type { ProductReview } from '@/lib/drizzle/server'
import { ResourceView } from '@/components/Base/Views'
import { productReviewConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditProductReviewPage() {
  const params = useParams()
  const id = params.id as string
  const { data: review, loading } = useResource<ProductReview>(`/api/dashboard/product-reviews/${id}`)

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${review?.title || 'Error'}`,
        formViewConfig: productReviewConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: productReviewConfig.defaultActions,
      }}
      initialData={review}
      entityId={id}
    />
  )
}
