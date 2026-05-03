import { FormConfig } from '@/components/admin/ResourceView/FormView'
import type { ProductVariant } from '@/lib/drizzle/server'

export const productVariantFormConfig: FormConfig = {
  entityName: 'Product Variant',
  entityNamePlural: 'Product Variants',
  apiEndpoint: '/api/admin/product-variants',
  fields: [
    {
      key: 'name',
      label: 'Variant Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Size M - Red',
      gridCols: 2,
      gridRow: 1,
      gridColumn: 1,
      order: 1
    },
    {
      key: 'sku',
      label: 'SKU',
      type: 'text',
      required: false,
      placeholder: 'e.g., PROD-M-RED',
      gridCols: 1,
      gridRow: 1,
      gridColumn: 2,
      order: 2
    },
    {
      key: 'barcode',
      label: 'Barcode',
      type: 'text',
      required: false,
      placeholder: 'e.g., 1234567890123',
      gridCols: 1,
      gridRow: 2,
      gridColumn: 1,
      order: 3
    },
    {
      key: 'price',
      label: 'Price',
      type: 'number',
      required: true,
      placeholder: '0.00',
      gridCols: 1,
      gridRow: 2,
      gridColumn: 2,
      order: 4
    },
    {
      key: 'compare_price',
      label: 'Compare Price',
      type: 'number',
      required: false,
      placeholder: '0.00',
      helper: 'Original price for comparison display',
      gridCols: 1,
      gridRow: 3,
      gridColumn: 1,
      order: 5
    },
    {
      key: 'cost_price',
      label: 'Cost Price',
      type: 'number',
      required: false,
      placeholder: '0.00',
      helper: 'Internal cost for profit calculation',
      gridCols: 1,
      gridRow: 3,
      gridColumn: 2,
      order: 6
    },
    {
      key: 'stock',
      label: 'Stock Quantity',
      type: 'number',
      required: true,
      placeholder: '0',
      gridCols: 1,
      gridRow: 4,
      gridColumn: 1,
      order: 7
    },
    {
      key: 'weight',
      label: 'Weight (kg)',
      type: 'number',
      required: false,
      placeholder: '0.00',
      gridCols: 1,
      gridRow: 4,
      gridColumn: 2,
      order: 8
    },
    {
      key: 'active',
      label: 'Active',
      type: 'toggle',
      required: false,
      gridCols: 1,
      gridRow: 5,
      gridColumn: 1,
      order: 9
    },
    {
      key: 'position',
      label: 'Position',
      type: 'number',
      required: false,
      placeholder: '0',
      helper: 'Display order (lower numbers appear first)',
      gridCols: 1,
      gridRow: 5,
      gridColumn: 2,
      order: 10
    }
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/product-variants',
    create: '/admin/product-variants/new',
    edit: '/admin/product-variants'
  }
}

export type ProductVariantFormConfig = typeof productVariantFormConfig
