import { FormConfig } from '@/components/admin/ResourceView/FormView'

export const configurationFormConfig: FormConfig = {
  entityName: 'Configuration',
  entityNamePlural: 'Configurations',
  apiEndpoint: '/api/configurations',
  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'text',
      required: true,
      placeholder: 'config-001',
      gridCols: 1,
      gridRow: 1,
      gridColumn: 1,
      order: 1
    },
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      placeholder: 'site_name',
      gridCols: 1,
      gridRow: 1,
      gridColumn: 2,
      order: 2
    },
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: [
        { value: 'string', label: 'String' },
        { value: 'number', label: 'Number' },
        { value: 'boolean', label: 'Boolean' },
        { value: 'json', label: 'JSON' }
      ],
      gridCols: 1,
      gridRow: 2,
      gridColumn: 1,
      order: 3
    },
    {
      key: 'category',
      label: 'Category',
      type: 'text',
      required: true,
      placeholder: 'general',
      gridCols: 1,
      gridRow: 2,
      gridColumn: 2,
      order: 4
    },
    {
      key: 'value',
      label: 'Value',
      type: 'textarea',
      required: true,
      placeholder: 'Configuration value',
      gridCols: 2,
      gridRow: 3,
      gridColumn: 1,
      order: 5
    }
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/configurations',
    create: '/admin/configurations/new',
    edit: '/admin/configurations'
  }
}

export type ConfigurationFormConfig = typeof configurationFormConfig
