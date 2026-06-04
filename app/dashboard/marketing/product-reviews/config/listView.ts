import { ListViewConfig } from '@/components/Base/Views/ListView'

export const productReviewListConfig: ListViewConfig = {
  title: 'Product Reviews',
  data: [],
  columns: [
    { key: 'rating', title: 'Rating', width: 80, sortable: true },
    { key: 'title', title: 'Title', width: 200, sortable: true },
    { key: 'user_id', title: 'User', width: 100 },
    { key: 'product_id', title: 'Product ID', width: 80 },
    { key: 'approved', title: 'Approved', type: 'boolean', width: 80, sortable: true },
    { key: 'body', title: 'Review', width: 300, render: (v: any) => v?.substring(0, 100) + (v?.length > 100 ? '...' : '') },
    { key: 'created_at', title: 'Date', type: 'date', width: 150, sortable: true },
  ]
}

export type ProductReviewListConfig = typeof productReviewListConfig
