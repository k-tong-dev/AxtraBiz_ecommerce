import {FormConfig} from '@/components/admin/ResourceView/FormView'
import type {Many2ManyWidgetConfig} from '@/components/admin/ResourceView/FieldWidgets'
import type {ProductAttributeValue} from '@/lib/drizzle/server'

export const productAttributeValueFormConfig: FormConfig = {
    entityName: 'Product Attribute Value',
    entityNamePlural: 'Product Attribute Values',
    apiEndpoint: '/api/admin/product-attribute-values',
    fields: [
        {
            key: 'name',
            label: 'Value Name',
            type: 'text',
            required: true,
            placeholder: 'e.g., Red, Large, Cotton',
            gridCols: 2,
            gridRow: 1,
            gridColumn: 1,
            order: 1
        },
        {
            key: 'value',
            label: 'Value Code',
            type: 'text',
            required: true,
            placeholder: 'e.g., red, L, cotton',
            helper: 'Internal value code (lowercase, no spaces)',
            gridCols: 2,
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
        },
        {
            key: 'active',
            label: 'Active',
            type: 'boolean',
            required: false,
            gridCols: 1,
            gridRow: 2,
            gridColumn: 2,
            order: 4
        }
    ],
    pages: [
        {
            key: 'linked_attributes',
            label: 'Linked Attributes',
            fields: [
                {
                    key: 'attribute_ids',
                    label: 'Used By Attributes',
                    type: 'many2many',
                    gridCols: 3,
                    gridRow: 1,
                    gridColumn: 1,
                    order: 1,
                    widgetConfig: {
                        // Junction table: links values to attributes
                        junctionTable: '/api/admin/product-attribute-values-rel',
                        localField: 'value_id',
                        remoteField: 'attribute_id',
                        // Related records: product attributes
                        relation: '/api/admin/product-attributes',
                        displayField: 'name',
                        valueField: 'id',
                        // Extra data on junction
                        columns: [
                            {
                                key: 'position',
                                title: 'Position',
                                width: 80,
                                type: 'number',
                                editable: true
                            }
                        ],
                        mode: 'list',
                        allowSelect: true,
                        allowRemove: true,
                        allowEdit: true,
                        allowCreate: true,
                    } as Many2ManyWidgetConfig
                }
            ],
            order: 100
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
