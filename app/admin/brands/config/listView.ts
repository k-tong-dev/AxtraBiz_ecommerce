import { ListViewConfig } from '@/components/Base/Views/ListView'
import { createElement } from 'react'
import { SiBrandfolder } from 'react-icons/si'

export const brandListConfig: ListViewConfig = {
  title: 'Brands',
  data: [],
  columns: [
    {
      key: 'logo_url',
      title: 'Logo',
      width: 80,
      render: (value: string) => value
        ? createElement('img', { src: value, className: 'w-8 h-8 rounded-full object-cover', alt: 'logo' })
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
