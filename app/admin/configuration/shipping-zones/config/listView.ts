import { ListViewConfig } from '@/components/Base/Views/ListView'
export const shippingZoneListConfig: ListViewConfig = {
  title: 'Shipping Zones',
  data: [],
  columns: [
    { key: 'name', title: 'Name', width: 180, sortable: true },
    { key: 'countries', title: 'Countries', width: 200 },
    { key: 'base_rate', title: 'Base Rate', width: 100, sortable: true },
    { key: 'free_shipping_threshold', title: 'Free Ship Threshold', width: 140 },
    { key: 'active', title: 'Active', type: 'boolean', width: 80, sortable: true },
  ]
}
export type ShippingZoneListConfig = typeof shippingZoneListConfig
