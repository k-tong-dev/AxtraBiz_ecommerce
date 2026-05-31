import { ListViewConfig } from '@/components/Base/Views/ListView'

export const paymentMethodListConfig: ListViewConfig = {
  title: 'Payment Methods',
  data: [],
  columns: [
    { key: 'type', title: 'Type', width: 120, render: (v: any) => v?.replace(/_/g, ' ') },
    { key: 'brand', title: 'Brand', width: 120 },
    { key: 'last4', title: 'Last 4', width: 80 },
    { key: 'expiry_month', title: 'Exp. Month', width: 80 },
    { key: 'expiry_year', title: 'Exp. Year', width: 80 },
    { key: 'is_default', title: 'Default', type: 'boolean', width: 80 },
    { key: 'active', title: 'Active', type: 'boolean', width: 80 },
  ]
}

export type PaymentMethodListConfig = typeof paymentMethodListConfig
