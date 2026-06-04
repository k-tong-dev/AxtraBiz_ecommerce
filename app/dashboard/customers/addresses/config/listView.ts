import { ListViewConfig } from '@/components/Base/Views/ListView'

export const addressListConfig: ListViewConfig = {
  title: 'Addresses',
  data: [],
  columns: [
    { key: 'user_id', title: 'User ID', width: 100 },
    { key: 'type', title: 'Type', width: 100 },
    { key: 'name', title: 'Name', width: 150, sortable: true },
    { key: 'street', title: 'Street', width: 200 },
    { key: 'city', title: 'City', width: 150, sortable: true },
    { key: 'state', title: 'State', width: 100 },
    { key: 'postal_code', title: 'Postal Code', width: 100 },
    { key: 'country', title: 'Country', width: 80 },
    { key: 'phone', title: 'Phone', width: 120 },
    { key: 'is_default', title: 'Default', type: 'boolean', width: 80 },
  ]
}

export type AddressListConfig = typeof addressListConfig
