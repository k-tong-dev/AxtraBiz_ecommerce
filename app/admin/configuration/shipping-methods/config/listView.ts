import { ListViewConfig } from '@/components/Base/Views/ListView'
import { createElement } from 'react'

export const shippingMethodListConfig: ListViewConfig = {
  title: 'Shipping Methods',
  data: [],
  columns: [
    { key: 'name', title: 'Name', width: 200, sortable: true },
    { key: 'carrier', title: 'Carrier', width: 150 },
    { key: 'rate_type', title: 'Rate Type', width: 120, render: (v: any) => v?.replace(/_/g, ' ') },
    { key: 'rate_amount', title: 'Rate', width: 100, sortable: true },
    { key: 'free_shipping_threshold', title: 'Free Threshold', width: 120 },
    { key: 'estimated_days_min', title: 'Min Days', width: 80 },
    { key: 'estimated_days_max', title: 'Max Days', width: 80 },
    { key: 'active', title: 'Active', type: 'boolean', width: 80, sortable: true },
  ]
}
export type ShippingMethodListConfig = typeof shippingMethodListConfig
