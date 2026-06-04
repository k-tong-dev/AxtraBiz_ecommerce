import { ListViewConfig } from '@/components/Base/Views/ListView'
export const taxRateListConfig: ListViewConfig = {
  title: 'Tax Rates',
  data: [],
  columns: [
    { key: 'name', title: 'Name', width: 180, sortable: true },
    { key: 'country', title: 'Country', width: 100, sortable: true },
    { key: 'region', title: 'Region', width: 120 },
    { key: 'rate', title: 'Rate (%)', width: 100, sortable: true },
    { key: 'postal_code', title: 'Postal Code', width: 120 },
    { key: 'active', title: 'Active', type: 'boolean', width: 80, sortable: true },
  ]
}
export type TaxRateListConfig = typeof taxRateListConfig
