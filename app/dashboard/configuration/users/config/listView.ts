import { ListViewConfig } from '@/components/Base/Views/ListView'

export const staffListConfig: ListViewConfig = {
  title: 'Staff Accounts',
  data: [],
  columns: [
    { key: 'full_name', title: 'Name', width: 200, sortable: true },
    { key: 'email', title: 'Email', width: 250, sortable: true },
    { key: 'status', title: 'Status', width: 100, sortable: true },
    { key: 'is_owner', title: 'Owner', type: 'boolean', width: 80, sortable: true },
    { key: 'last_login_at', title: 'Last Login', width: 180 },
  ]
}

export type StaffListConfig = typeof staffListConfig
