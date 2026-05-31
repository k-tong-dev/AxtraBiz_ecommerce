import { ListViewConfig } from '@/components/Base/Views/ListView'

export const menuListConfig: ListViewConfig = {
  title: 'Menus',
  columns: [
    { key: 'id', title: 'ID', width: 80, sortable: true },
    { key: 'name', title: 'Name', width: 200, sortable: true },
    { key: 'slug', title: 'Slug', width: 200, sortable: true },
    {
      key: 'items',
      title: 'Items',
      width: 80,
      sortable: false,
      render: (value: any[]) => {
        if (!value || !Array.isArray(value)) return '0'
        return String(value.length)
      }
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

export type MenuListConfig = typeof menuListConfig
