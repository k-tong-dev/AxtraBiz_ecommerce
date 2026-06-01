import { ListViewConfig } from '@/components/Base/Views/ListView'
import { createElement } from 'react'
import { SiBrandfolder } from 'react-icons/si'

export const brandListConfig: ListViewConfig = {
  title: 'Brands',
  data: [],
  columns: [
    {
      key: 'image_id',
      title: 'Logo',
      width: 80,
      render: (value: any) => value?.url
        ? createElement('img', { src: value.url, className: 'w-8 h-8 rounded-full object-cover', alt: 'logo' })
        : null,
    },
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
      type: 'boolean',
      width: 100,
      sortable: true,
    }
  ]
}

export type BrandListConfig = typeof brandListConfig
