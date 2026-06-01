import { FormConfig } from '@/components/Base/Views/FormView'

export const productAttributeFormConfig: FormConfig = {
  entityName: 'Product Attribute',
  entityNamePlural: 'Product Attributes',
  apiEndpoint: '/api/admin/product-attributes',
  fields: [
    {
      key: 'name',
      label: 'Attribute Name',
      type: 'string',
      required: true,
      placeholder: 'e.g., Size, Color, Material',
      columnWidth: 2,
      groupNumber: 1,
      groupColumn: 1,
      order: 1
    },
    {
      key: 'type',
      label: 'Attribute Type',
      type: 'selection',
      required: true,
      options: [
        { label: 'Select Dropdown', value: 'select' },
        { label: 'Radio Buttons', value: 'radio' },
        { label: 'Color Swatches', value: 'color' },
        { label: 'Text Input', value: 'text' },
        { label: 'Image', value: 'image' }
      ],
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 2,
      order: 2
    },
    {
      key: 'position',
      label: 'Position',
      type: 'number',
      required: false,
      placeholder: '0',
      helper: 'Display order (lower numbers appear first)',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 1,
      order: 3
    }
  ],
  pages: [
    {
      key: 'values',
      label: 'Attribute Values',
      fields: [
        {
          key: 'value_ids',
          label: 'Values',
          type: 'one2many',
          columnWidth: 3,
          groupNumber: 1,
          groupColumn: 1,
          order: 1,
          fetchUrl: '/api/admin/product-attribute-values',
        }
      ],
      order: 100
    }
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/inventory/product-attributes',
    create: '/admin/inventory/product-attributes/new',
    edit: '/admin/inventory/product-attributes'
  }
}

export type ProductAttributeFormConfig = typeof productAttributeFormConfig
