import { ListViewConfig } from '@/components/admin/ResourceView/ListView'

export const customerListConfig: ListViewConfig = {
  title: 'Customers',
  columns: [
    {
      key: 'id',
      title: 'Customer ID',
      width: 140,
      sortable: true
    },
    {
      key: 'name',
      title: 'Name',
      width: 200,
      sortable: true
    },
    {
      key: 'email',
      title: 'Email',
      width: 250,
      sortable: true
    },
    {
      key: 'role',
      title: 'Role',
      width: 100,
      sortable: true
    },
    {
      key: 'active',
      title: 'Active',
      width: 80,
      sortable: true,
      render: (value: boolean) => value ? 'Yes' : 'No'
    },
    {
      key: 'created_at',
      title: 'Created',
      width: 140,
      sortable: true,
      render: (value: string) => {
        if (!value) return ''
        return new Date(value).toLocaleDateString()
      }
    }
  ],
  data: [],
  showSearch: true,
  pageSize: 20
}

export type CustomerListConfig = typeof customerListConfig
