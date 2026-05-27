import { FormConfig } from '@/components/Base/Views/FormView'

export const productAttributeValueFormConfig: FormConfig = {
  entityName: 'Product Attribute Value',
  entityNamePlural: 'Product Attribute Values',
  apiEndpoint: '/api/admin/product-attribute-values',
  fields: [
    {
      key: 'name',
      label: 'Value Name',
      type: 'string',
      required: true,
      placeholder: 'e.g., Red, Large, Cotton',
      columnWidth: 2,
      groupNumber: 1,
      groupColumn: 1,
      order: 1
    },
    {
      key: 'value',
      label: 'Value Code',
      type: 'string',
      required: true,
      placeholder: 'e.g., red, L, cotton',
      helper: 'Internal value code (lowercase, no spaces)',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 1,
      order: 2
    },
    {
      key: 'attribute_id',
      label: 'Attribute',
      type: 'many2one',
      readonly: true,
      required: false,
      columnWidth: 2,
      groupNumber: 1,
      groupColumn: 2,
      order: 3,
      fetchUrl: '/api/admin/product-attributes',
    },
    {
      key: 'position',
      label: 'Position',
      type: 'number',
      required: false,
      placeholder: '0',
      helper: 'Display order (lower numbers appear first)',
      columnWidth: 2,
      groupNumber: 1,
      groupColumn: 1,
      order: 4
    },
    {
      key: 'active',
      label: 'Active',
      type: 'boolean',
      required: false,

      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 2,
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
