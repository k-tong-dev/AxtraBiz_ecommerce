import { FormConfig } from '@/components/Base/Views/FormView'

export const configurationFormConfig: FormConfig = {
  entityName: 'Configuration',
  entityNamePlural: 'Configurations',
  apiEndpoint: '/api/admin/configurations',
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
        { value: 'json', label: 'JSON' },
        { value: 'text', label: 'Text' }
      ],
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 1,
      order: 3
    },
    {
      key: 'category',
      label: 'Category',
      type: 'selection',
      required: true,
      options: [
        { value: 'general', label: 'General' },
        { value: 'store', label: 'Store' },
        { value: 'email', label: 'Email' },
        { value: 'payment', label: 'Payment' },
        { value: 'shipping', label: 'Shipping' },
        { value: 'seo', label: 'SEO' },
        { value: 'api', label: 'API' }
      ],
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
    list: '/admin/system/configurations',
    create: '/admin/system/configurations/new',
    edit: '/admin/system/configurations'
  }
}

export type ConfigurationFormConfig = typeof configurationFormConfig
