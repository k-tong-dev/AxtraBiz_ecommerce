import { ListViewConfig } from '@/components/Base/Views/ListView'

export const staffListConfig: ListViewConfig = {
  title: 'Users',
  data: [],
  columns: [
    { key: 'displayName', title: 'Name', width: 200, sortable: true },
    { key: 'email', title: 'Email', width: 250, sortable: true },
    { key: 'phone', title: 'Phone', width: 150 },
    { key: 'userRole', title: 'Role', width: 120, sortable: true },
    { key: 'isVerified', title: 'Verified', type: 'boolean', width: 100, sortable: true },
    { key: 'isShopOwner', title: 'Shop Owner', type: 'boolean', width: 110, sortable: true },
    { key: 'active', title: 'Active', type: 'boolean', width: 90, sortable: true },
  ]
}

export type StaffListConfig = typeof staffListConfig
