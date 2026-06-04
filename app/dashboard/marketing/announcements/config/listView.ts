import { ListViewConfig } from '@/components/Base/Views/ListView'

export const announcementListConfig: ListViewConfig = {
  title: 'Announcements',
  columns: [
    {
      key: 'id',
      title: 'ID',
      width: 140,
      sortable: true
    },
    {
      key: 'title',
      title: 'Title',
      width: 250,
      sortable: true
    },
    {
      key: 'type',
      title: 'Type',
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
      key: 'start_date',
      title: 'Start Date',
      width: 140,
      sortable: true,
      render: (value: string) => {
        if (!value) return ''
        return new Date(value).toLocaleDateString()
      }
    },
    {
      key: 'end_date',
      title: 'End Date',
      width: 140,
      sortable: true,
      render: (value: string) => {
        if (!value) return ''
        return new Date(value).toLocaleDateString()
      }
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

export type AnnouncementListConfig = typeof announcementListConfig
