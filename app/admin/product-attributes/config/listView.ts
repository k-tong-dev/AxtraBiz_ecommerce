import { ListViewConfig } from '@/components/Base/Views/ListView'
import type { ProductAttribute } from '@/lib/drizzle/server'

export const getProductAttributeListConfig = (data: any[] = []): ListViewConfig => ({
  title: 'Product Attributes',
  columns: [
    {
      key: 'name',
      title: 'Attribute Name',
      width: 250,
      sortable: true
    },
    {
      key: 'type',
      title: 'Type',
      width: 150,
      sortable: true
    },
    {
      key: 'position',
      title: 'Position',
      width: 100,
      sortable: true
    },
    {
      key: 'created_at',
      title: 'Created At',
      width: 180,
      sortable: true
    },
    {
      key: 'updated_at',
      title: 'Updated At',
      width: 180,
      sortable: true
    }
  ],
  data: data,
  showSearch: false,
  showColumnToggle: false,
  showFilters: false,
  showExport: false,
  pageSize: 20
})

export type ProductAttributeListConfig = ReturnType<typeof getProductAttributeListConfig>
