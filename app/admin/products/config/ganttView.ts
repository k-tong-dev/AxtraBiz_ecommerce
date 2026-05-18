import { GanttViewConfig } from '@/components/Base/Views/GanttView'

export const getProductGanttConfig = (data: any[] = []): GanttViewConfig => ({
  data: data,
  columns: [
    { key: 'id', title: 'ID', width: 80 },
    { key: 'name', title: 'Product Name', flexGrow: 1, treeCol: true },
    { key: 'sku', title: 'SKU', width: 120 },
    { key: 'status', title: 'Status', width: 100 },
    { key: 'stock', title: 'Stock', width: 80 },
  ],
  startDateKey: 'sale_start_date',
  endDateKey: 'sale_end_date',
  titleKey: 'name',
  rowKey: 'id',
  height: 500,
  onRowClick: (rowData) => console.log('Row clicked:', rowData),
  onEdit: (rowData) => console.log('Edit:', rowData),
  onDelete: (rowData) => console.log('Delete:', rowData),
})
