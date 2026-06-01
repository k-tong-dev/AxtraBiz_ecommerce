import { ListViewConfig } from '@/components/Base/Views/ListView'

export const shopListConfig: ListViewConfig = {
  title: 'Shops',
  data: [],
  columns: [
    { key: 'name', title: 'Name', width: 200, sortable: true },
    { key: 'slug', title: 'Slug', width: 180, sortable: true },
    { key: 'domain', title: 'Domain', width: 200 },
    { key: 'email', title: 'Email', width: 200 },
    { key: 'active', title: 'Active', type: 'boolean', width: 80, sortable: true },
  ]
}

export type ShopListConfig = typeof shopListConfig
