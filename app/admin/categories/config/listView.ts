import { ListViewConfig } from '@/components/Base/Views/ListView'

export const categoryListConfig: ListViewConfig = {
  title: 'Categories',
  columns: [
    {
      key: 'name',
      title: 'Name',
      width: 200,
      sortable: true,
    },
    {
      key: 'slug',
      title: 'Slug',
      width: 200,
      sortable: true,
    },
    {
      key: 'position',
      title: 'Position',
      width: 100,
      sortable: true,
    },
    {
      key: 'active',
      title: 'Active',
      type: 'boolean',
      width: 80,
      sortable: true,
      render: (value: boolean) => value !== false ? 'Yes' : 'No'
    },
    {
      key: 'created_at',
      title: 'Created',
      width: 140,
      sortable: true,
      render: (value: string) => value ? new Date(value).toLocaleDateString() : ''
    }
  ],
  data: [],
  showSearch: true,
  pageSize: 20
}

export type CategoryListConfig = typeof categoryListConfig
