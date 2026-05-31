'use client'

import { couponConfig } from '../config'
import { ResourceView } from '@/components/Base/Views'

export default function NewCouponPage() {
  return (
    <ResourceView
      config={{
        type: 'form',
        title: 'New Coupon',
        formViewConfig: couponConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: couponConfig.defaultActions,
      }}
      initialData={{}}
    />
  )
}
