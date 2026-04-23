import { FormConfig } from '@/components/admin/ResourceView/FormView'
import type { Product } from '@/lib/drizzle/server'

export const productFormConfig: FormConfig = {
  entityName: 'Product',
  entityNamePlural: 'Products',
  apiEndpoint: '/api/products',
  fields: [
    // Media & Files Section - Always first
    {
      key: 'image_ids',
      label: 'Product Images',
      type: 'file',
      required: false,
      placeholder: 'Upload product images',
      gridCols: 1,
      order: 1
    },

    // Basic Information Section
    {
      key: 'name',
      label: 'Product Name',
      type: 'text',
      required: true,
      placeholder: 'Enter product name',
      validation: (value) => {
        if (!value || value.trim().length < 2) return 'Product name must be at least 2 characters'
        return null
      },
      rows: 1,
      gridCols: 2,
      gridRow: 1,
      gridColumn: 1,
      order: 2
    },
    {
      key: 'slug',
      label: 'Slug',
      type: 'text',
      required: true,
      placeholder: 'Enter slug',
      validation: (value) => {
        if (!value || value.trim().length < 2) return 'Product slug must be at least 2 characters'
        return null
      },
      rows: 1,
      gridCols: 1,
      gridRow: 1,
      gridColumn: 1,
      order: 3
    },
    {
      key: 'barcode',
      label: 'Barcode',
      type: 'text',
      required: false,
      placeholder: 'Enter Barcode',
      rows: 1,
      gridCols: 2,
      gridRow: 1,
      gridColumn: 1,
      order: 4
    },
    {
      key: 'category_id',
      label: 'Category',
      type: 'select',
      required: false,
      placeholder: 'Select category',
      options: [],
      gridCols: 1,
      gridRow: 1,
      gridColumn: 2,
      order: 5
    },
    {
      key: 'brand_id',
      label: 'Brand',
      type: 'select',
      required: false,
      placeholder: 'Select brand',
      options: [],
      gridCols: 1,
      gridRow: 1,
      gridColumn: 2,
      order: 6
    },
    {
      key: 'tax_rate_id',
      label: 'Tax Rate',
      type: 'select',
      required: false,
      placeholder: 'Select tax rate',
      options: [],
      gridCols: 1,
      gridRow: 1,
      gridColumn: 2,
      order: 7
    },
    {
      key: 'product_type',
      label: 'Product Type',
      type: 'select',
      required: true,
      placeholder: 'Select product type',
      options: [
        { label: 'Simple', value: 'simple' },
        { label: 'Variable', value: 'variable' },
        { label: 'Grouped', value: 'grouped' },
        { label: 'Bundle', value: 'bundle' },
        { label: 'Digital', value: 'digital' }
      ],
      gridCols: 1,
      gridRow: 1,
      gridColumn: 2,
      order: 8
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      required: true,
      placeholder: 'Select status',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' }
      ],
      gridCols: 1,
      gridRow: 1,
      gridColumn: 2,
      order: 9
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      placeholder: 'Enter detailed product description',
      rows: 3,
      gridCols: 3,
      gridRow: 2,
      gridColumn: 1,
      order: 10
    },

    // SEO Section
    {
      key: 'meta_title',
      label: 'Meta Title',
      type: 'text',
      required: false,
      placeholder: 'SEO title (max 60 chars)',
      gridCols: 1,
      gridRow: 3,
      gridColumn: 1,
      order: 11
    },
    {
      key: 'meta_description',
      label: 'Meta Description',
      type: 'textarea',
      required: false,
      placeholder: 'SEO description (max 160 chars)',
      rows: 2,
      gridCols: 2,
      gridRow: 3,
      gridColumn: 2,
      order: 12
    },
    {
      key: 'meta_keywords',
      label: 'Meta Keywords',
      type: 'text',
      required: false,
      placeholder: 'Comma-separated keywords',
      gridCols: 3,
      gridRow: 4,
      gridColumn: 1,
      order: 13
    },

    // Tags
    {
      key: 'tags',
      label: 'Tags',
      type: 'text',
      required: false,
      placeholder: 'Comma-separated tags',
      gridCols: 3,
      gridRow: 5,
      gridColumn: 1,
      order: 14
    },

    // Pricing Section
    {
      key: 'price',
      label: 'Sale Price',
      type: 'number',
      required: true,
      placeholder: '0.00',
      validation: (value) => {
        if (value < 0) return 'Price must be greater than or equal to 0'
        if (value > 999999.99) return 'Price cannot exceed 999,999.99'
        return null
      },
      gridCols: 1,
      gridRow: 3,
      gridColumn: 1,
      order: 15
    },
    {
      key: 'compare_price',
      label: 'Compare Price',
      type: 'number',
      required: false,
      placeholder: '0.00',
      validation: (value) => {
        if (value && value < 0) return 'Compare price must be greater than or equal to 0'
        if (value > 999999.99) return 'Compare price cannot exceed 999,999.99'
        return null
      },
      gridCols: 1,
      gridRow: 3,
      gridColumn: 2,
      order: 16
    },
    {
      key: 'cost_price',
      label: 'Cost Price',
      type: 'number',
      required: false,
      placeholder: '0.00',
      validation: (value) => {
        if (value && value < 0) return 'Cost price must be greater than or equal to 0'
        if (value > 999999.99) return 'Cost price cannot exceed 999,999.99'
        return null
      },
      gridCols: 1,
      gridRow: 3,
      gridColumn: 3,
      order: 17
    },

    // Inventory Section
    {
      key: 'sku',
      label: 'SKU (Stock Keeping Unit)',
      type: 'text',
      required: false,
      placeholder: 'Enter SKU',
      validation: (value) => {
        if (value && !/^[A-Z0-9-]+$/.test(value)) return 'SKU can only contain uppercase letters and numbers'
        return null
      },
      gridCols: 2,
      gridRow: 4,
      gridColumn: 1,
      order: 18
    },
    {
      key: 'stock',
      label: 'Stock Quantity',
      readonly: true,
      type: 'number',
      required: false,
      placeholder: '0',
      validation: (value) => {
        if (value < 0) return 'Stock must be greater than or equal to 0'
        if (value > 999999) return 'Stock cannot exceed 999,999'
        return null
      },
      gridCols: 1,
      gridRow: 7,
      gridColumn: 2,
      order: 19
    },
    {
      key: 'track_inventory',
      label: 'Track Inventory',
      type: 'toggle',
      required: false,
      gridCols: 1,
      gridRow: 7,
      gridColumn: 1,
      order: 20
    },
    {
      key: 'low_stock_threshold',
      label: 'Low Stock Threshold',
      type: 'number',
      required: false,
      placeholder: '10',
      validation: (value) => {
        if (value < 0) return 'Threshold must be greater than or equal to 0'
        return null
      },
      gridCols: 1,
      gridRow: 7,
      gridColumn: 3,
      order: 21
    },
    {
      key: 'allow_backorders',
      label: 'Allow Backorders',
      type: 'toggle',
      required: false,
      gridCols: 1,
      gridRow: 8,
      gridColumn: 1,
      order: 22
    },
    {
      key: 'weight',
      label: 'Weight (kg)',
      type: 'number',
      required: false,
      placeholder: '0.0',
      validation: (value) => {
        if (value && value < 0) return 'Weight must be greater than or equal to 0'
        if (value > 1000) return 'Weight cannot exceed 1000 kg'
        return null
      },
      gridCols: 1,
      gridRow: 5,
      gridColumn: 1,
      order: 23
    },
    {
      key: 'dimensions',
      label: 'Dimensions (L×W×H)',
      type: 'text',
      required: false,
      placeholder: 'Length × Width × Height (cm)',
      validation: (value) => {
        if (value && !/^\d+\s*×\s*\d+\s*×\s*\d+$/.test(value)) return 'Please enter valid dimensions (e.g., 10 × 20 × 5)'
        return null
      },
      gridCols: 2,
      gridRow: 5,
      gridColumn: 1,
      order: 24
    },
    {
      key: 'active',
      label: 'Active Status',
      type: 'toggle',
      required: false,
      gridCols: 1,
      gridRow: 9,
      gridColumn: 1,
      order: 25
    },

    // Sale Schedule
    {
      key: 'sale_start_date',
      label: 'Sale Start Date',
      type: 'date',
      required: false,
      placeholder: 'Select start date',
      gridCols: 1,
      gridRow: 10,
      gridColumn: 1,
      order: 26
    },
    {
      key: 'sale_end_date',
      label: 'Sale End Date',
      type: 'date',
      required: false,
      placeholder: 'Select end date',
      gridCols: 1,
      gridRow: 10,
      gridColumn: 2,
      order: 27
    },
    {
      key: 'published_at',
      label: 'Published At',
      type: 'date',
      required: false,
      placeholder: 'Select publish date',
      gridCols: 1,
      gridRow: 10,
      gridColumn: 3,
      order: 28
    }
  ],
  // actions and customActions removed - now using centralized serverActions from ResourceView
  breadcrumbs: {
    base: '/admin',
    list: '/admin/products',
    create: '/admin/products/new',
    edit: '/admin/products'
  }
}

export type ProductFormConfig = typeof productFormConfig
