import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const productReviewFormConfig: FormConfig = {
  entityName: 'Product Review',
  entityNamePlural: 'Product Reviews',
  apiEndpoint: '/api/admin/marketing/product-reviews',
  fields: [
    { key: 'user_id', label: 'User ID', type: 'string', required: true, columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'product_id', label: 'Product ID', type: 'number', required: true, columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 1 },
    { key: 'variant_id', label: 'Variant ID', type: 'number', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'rating', label: 'Rating', type: 'number', required: true, placeholder: '5', columnWidth: 1, groupNumber: 2, groupColumn: 2, order: 1 },
    { key: 'title', label: 'Title', type: 'string', placeholder: 'Great product!', columnWidth: 2, groupNumber: 3, groupColumn: 1, order: 0 },
    { key: 'body', label: 'Review', type: 'html', placeholder: 'Write your review...', columnWidth: 2, groupNumber: 4, groupColumn: 1, order: 0 },
    { key: 'approved', label: 'Approved', type: 'boolean', columnWidth: 1, groupNumber: 5, groupColumn: 1, order: 0 },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/marketing/product-reviews',
    create: '/admin/marketing/product-reviews/new',
    edit: '/admin/marketing/product-reviews'
  }
}

export type ProductReviewFormConfig = typeof productReviewFormConfig
