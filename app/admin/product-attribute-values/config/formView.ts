import { FormConfig } from '@/components/admin/ResourceView/FormView'
import type { ProductAttributeValue } from '@/lib/drizzle/server'

export const productAttributeValueFormConfig: FormConfig = {
  entityName: 'Product Attribute Value',
  entityNamePlural: 'Product Attribute Values',
  apiEndpoint: '/api/admin/product-attribute-values',
  fields: [
    {
      key: 'attribute_id',
      label: 'Attribute',
      type: 'select',
      required: true,
      placeholder: 'Select an attribute',
      gridCols: 2,
      gridRow: 1,
      gridColumn: 1,
      order: 1
    },
    {
      key: 'name',
      label: 'Value Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Red, Large, Cotton',
      gridCols: 2,
      gridRow: 1,
      gridColumn: 2,
      order: 2
    },
    {
      key: 'value',
      label: 'Value',
      type: 'text',
      required: true,
      placeholder: 'e.g., red, L, cotton',
      helper: 'Internal value code (lowercase, no spaces)',
      gridCols: 2,
      gridRow: 2,
      gridColumn: 1,
      order: 3
    },
    {
      key: 'position',
      label: 'Position',
      type: 'number',
      required: false,
      placeholder: '0',
      helper: 'Display order (lower numbers appear first)',
      gridCols: 1,
      gridRow: 2,
      gridColumn: 2,
      order: 4
    },
    {
      key: 'active',
      label: 'Active',
      type: 'boolean',
      required: false,
      gridCols: 1,
      gridRow: 3,
      gridColumn: 1,
      order: 5
    }
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/product-attribute-values',
    create: '/admin/product-attribute-values/new',
    edit: '/admin/product-attribute-values'
  }
}

export type ProductAttributeValueFormConfig = typeof productAttributeValueFormConfig
