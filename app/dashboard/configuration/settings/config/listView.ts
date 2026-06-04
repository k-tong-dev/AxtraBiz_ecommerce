import { ListViewConfig } from '@/components/Base/Views/ListView'

export const settingListConfig: ListViewConfig = {
  title: 'Settings',
  columns: [
    {
      key: 'id',
      title: 'ID',
      width: 120,
      sortable: true
    },
    {
      key: 'key',
      title: 'Key',
      width: 200,
      sortable: true
    },
    {
      key: 'category',
      title: 'Category',
      width: 120,
      sortable: true
    },
    {
      key: 'value',
      title: 'Value',
      width: 300,
      sortable: false,
      render: (value: string) => {
        if (!value) return ''
        return value.length > 50 ? value.substring(0, 50) + '...' : value
      }
    },
    {
      key: 'updated_at',
      title: 'Updated',
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

export type SettingListConfig = typeof settingListConfig
