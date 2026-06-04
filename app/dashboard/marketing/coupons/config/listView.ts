import { ListViewConfig } from '@/components/Base/Views/ListView'
import { createElement } from 'react'

export const couponListConfig: ListViewConfig = {
  title: 'Coupons',
  data: [],
  columns: [
    { key: 'code', title: 'Code', width: 150, sortable: true },
    { key: 'type', title: 'Type', width: 100, sortable: true, render: (v: any) => v?.replace(/_/g, ' ') },
    { key: 'value', title: 'Value', width: 100, sortable: true },
    { key: 'used_count', title: 'Used', width: 80 },
    { key: 'min_order_amount', title: 'Min Order', width: 100 },
    { key: 'starts_at', title: 'Start', type: 'date', width: 150 },
    { key: 'expires_at', title: 'Expires', type: 'date', width: 150 },
    { key: 'active', title: 'Active', type: 'boolean', width: 80, sortable: true },
  ]
}
export type CouponListConfig = typeof couponListConfig
