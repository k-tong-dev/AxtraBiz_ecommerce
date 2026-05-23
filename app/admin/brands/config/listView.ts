import { ListViewConfig } from '@/components/Base/Views/ListView'

export const brandListConfig: ListViewConfig = {
  title: 'Brands',
  data: [],
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
      key: 'website',
      title: 'Website',
      width: 200,
    },
    {
      key: 'active',
      title: 'Active',
      width: 100,
      sortable: true,
    }
  ]
}

export type BrandListConfig = typeof brandListConfig
