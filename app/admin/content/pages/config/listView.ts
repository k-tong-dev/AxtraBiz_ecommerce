import { ListViewConfig } from '@/components/Base/Views/ListView'
import { createElement } from 'react'

export const pageListConfig: ListViewConfig = {
  title: 'Pages',
  data: [],
  columns: [
    { key: 'title', title: 'Title', width: 250, sortable: true },
    { key: 'slug', title: 'Slug', width: 200, sortable: true },
    { key: 'status', title: 'Status', width: 100, sortable: true },
    { key: 'published_at', title: 'Published', type: 'date', width: 150 },
    { key: 'created_at', title: 'Created', type: 'date', width: 150 },
  ]
}
export type PageListConfig = typeof pageListConfig
