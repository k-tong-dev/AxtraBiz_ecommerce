import { FormConfig } from '@/components/admin/ResourceView/FormView'
import type { Many2ManyWidgetConfig } from '@/components/admin/ResourceView/FieldWidgets'
import type { ProductAttribute } from '@/lib/drizzle/server'

export const productAttributeFormConfig: FormConfig = {
  entityName: 'Product Attribute',
  entityNamePlural: 'Product Attributes',
  apiEndpoint: '/api/admin/product-attributes',
  fields: [
    {
      key: 'name',
      label: 'Attribute Name',
      type: 'text',
      required: true,
      placeholder: 'e.g., Size, Color, Material',
      gridCols: 2,
      gridRow: 1,
      gridColumn: 1,
      order: 1
    },
    {
      key: 'type',
      label: 'Attribute Type',
      type: 'select',
      required: true,
      options: [
        { label: 'Select Dropdown', value: 'select' },
        { label: 'Radio Buttons', value: 'radio' },
        { label: 'Color Swatches', value: 'color' },
        { label: 'Text Input', value: 'text' }
      ],
      gridCols: 1,
      gridRow: 1,
      gridColumn: 2,
      order: 2
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
      gridColumn: 1,
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
          type: 'many2many',
          gridCols: 3,
          gridRow: 1,
          gridColumn: 1,
          order: 1,
          widgetConfig: {
            // Junction table: links attributes to values
            junctionTable: '/api/admin/product-attribute-values-rel',
            localField: 'attribute_id',
            remoteField: 'value_id',
            // Related records: product attribute values
            relation: '/api/admin/product-attribute-values',
            displayField: 'name',
            valueField: 'id',
            // Extra data on junction
            columns: [
              { key: 'position', title: 'Position', width: 80, type: 'number', editable: true }
            ],
            mode: 'list',
            allowSelect: true,
            allowCreate: true,  // Allow creating new values inline
            allowRemove: true,
            allowEdit: true
          } as Many2ManyWidgetConfig
        }
      ],
      order: 100
    }
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/product-attributes',
    create: '/admin/product-attributes/new',
    edit: '/admin/product-attributes'
  }
}

export type ProductAttributeFormConfig = typeof productAttributeFormConfig
