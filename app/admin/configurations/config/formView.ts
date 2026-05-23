import { FormConfig } from '@/components/Base/Views/FormView'

export const configurationFormConfig: FormConfig = {
  entityName: 'Configuration',
  entityNamePlural: 'Configurations',
  apiEndpoint: '/api/configurations',
  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'string',
      required: true,
      placeholder: 'config-001',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 1,
      order: 1
    },
    {
      key: 'name',
      label: 'Name',
      type: 'string',
      required: true,
      placeholder: 'site_name',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 2,
      order: 2
    },
    {
      key: 'type',
      label: 'Type',
      type: 'selection',
      required: true,
      options: [
        { value: 'string', label: 'String' },
        { value: 'number', label: 'Number' },
        { value: 'boolean', label: 'Boolean' },
        { value: 'json', label: 'JSON' }
      ],
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 1,
      order: 3
    },
    {
      key: 'category',
      label: 'Category',
      type: 'string',
      required: true,
      placeholder: 'general',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 2,
      order: 4
    },
    {
      key: 'value',
      label: 'Value',
      type: 'html',
      required: true,
      placeholder: 'Configuration value',
      columnWidth: 2,
      groupNumber: 3,
      groupColumn: 1,
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
