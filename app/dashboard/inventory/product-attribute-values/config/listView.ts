import { ListViewConfig } from '@/components/Base/Views/ListView'
import type { ProductAttributeValue } from '@/lib/drizzle/server'

export const getProductAttributeValueListConfig = (data: any[] = []): ListViewConfig => ({
  title: 'Product Attribute Values',
  columns: [
    {
      key: 'name',
      title: 'Value Name',
      width: 200,
      sortable: true
    },
    {
      key: 'value',
      title: 'Value',
      width: 150,
      sortable: true
    },
    {
      key: 'attribute_id',
      title: 'Attribute ID',
      width: 200,
      sortable: true
    },
    {
      key: 'position',
      title: 'Position',
      width: 100,
      sortable: true
    },
    {
      key: 'active',
      title: 'Active',
      type: 'boolean',
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
  pageSize: 5
})

export type ProductAttributeValueListConfig = ReturnType<typeof getProductAttributeValueListConfig>
