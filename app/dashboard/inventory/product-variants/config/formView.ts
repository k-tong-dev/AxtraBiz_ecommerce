import { FormConfig } from '@/components/Base/Views/FormView'
import type { ProductVariant } from '@/lib/drizzle/server'

export const productVariantFormConfig: FormConfig = {
  entityName: 'Product Variant',
  entityNamePlural: 'Product Variants',
  apiEndpoint: '/api/dashboard/product-variants',
  fields: [
    {
      key: 'name',
      label: 'Variant Name',
      type: 'string',
      required: true,
      placeholder: 'e.g., Size M - Red',
      columnWidth: 2,
      groupNumber: 1,
      groupColumn: 1,
      order: 1
    },
    {
      key: 'sku',
      label: 'SKU',
      type: 'string',
      required: false,
      placeholder: 'e.g., PROD-M-RED',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 2,
      order: 2
    },
    {
      key: 'barcode',
      label: 'Barcode',
      type: 'string',
      required: false,
      placeholder: 'e.g., 1234567890123',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 1,
      order: 3
    },
    {
      key: 'price',
      label: 'Price',
      type: 'number',
      required: true,
      placeholder: '0.00',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 2,
      order: 4
    },
    {
      key: 'compare_price',
      label: 'Compare Price',
      type: 'number',
      required: false,
      placeholder: '0.00',
      helper: 'Original price for comparison display',
      columnWidth: 1,
      groupNumber: 3,
      groupColumn: 1,
      order: 5
    },
    {
      key: 'cost_price',
      label: 'Cost Price',
      type: 'number',
      required: false,
      placeholder: '0.00',
      helper: 'Internal cost for profit calculation',
      columnWidth: 1,
      groupNumber: 3,
      groupColumn: 2,
      order: 6
    },
    {
      key: 'stock',
      label: 'Stock Quantity',
      type: 'number',
      required: true,
      placeholder: '0',
      columnWidth: 1,
      groupNumber: 4,
      groupColumn: 1,
      order: 7
    },
    {
      key: 'weight',
      label: 'Weight (kg)',
      type: 'number',
      required: false,
      placeholder: '0.00',
      columnWidth: 1,
      groupNumber: 4,
      groupColumn: 2,
      order: 8
    },
    {
      key: 'active',
      label: 'Active',
      type: 'toggle',
      required: false,
      columnWidth: 1,
      groupNumber: 5,
      groupColumn: 1,
      order: 9
    },
    {
      key: 'position',
      label: 'Position',
      type: 'number',
      required: false,
      placeholder: '0',
      helper: 'Display order (lower numbers appear first)',
      columnWidth: 1,
      groupNumber: 5,
      groupColumn: 2,
      order: 10
    }
  ],
  breadcrumbs: {
    base: '/dashboard',
    list: '/dashboard/inventory/product-variants',
    create: '/dashboard/inventory/product-variants/new',
    edit: '/dashboard/inventory/product-variants'
  }
}

export type ProductVariantFormConfig = typeof productVariantFormConfig
