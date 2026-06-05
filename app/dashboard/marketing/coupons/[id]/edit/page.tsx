'use client'

import { useParams } from 'next/navigation'
import type { Coupon } from '@/lib/drizzle/schema'
import { ResourceView } from '@/components/Base/Views'
import { couponConfig } from '../../config'
import { useResource } from '@/components/Base/Views/hooks/useResource'

export default function EditCouponPage() {
  const params = useParams()
  const id = params.id as string
  const { data: coupon, loading } = useResource<Coupon>(`/api/dashboard/coupons/${id}`)

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${coupon?.code || 'Edit Coupon'}`,
        formViewConfig: couponConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: couponConfig.defaultActions,
      }}
      initialData={coupon}
      entityId={id}
    />
  )
}
