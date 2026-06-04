import { FormConfig } from '@/components/Base/Views/FormView'

export const settingFormConfig: FormConfig = {
  entityName: 'Setting',
  entityNamePlural: 'Settings',
  apiEndpoint: '/api/dashboard/settings',
  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'string',
      required: true,
      placeholder: 'setting-001',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 1,
      order: 1
    },
    {
      key: 'key',
      label: 'Key',
      type: 'string',
      required: true,
      placeholder: 'site_name',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 2,
      order: 2
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
        { value: 'seo', label: 'SEO' }
      ],
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 1,
      order: 3
    },
    {
      key: 'value',
      label: 'Value',
      type: 'html',
      required: true,
      placeholder: 'Setting value',
      columnWidth: 2,
      groupNumber: 3,
      groupColumn: 1,
      order: 4
    }
  ],
  breadcrumbs: {
    base: '/dashboard',
    list: '/dashboard/configuration/settings',
    create: '/dashboard/configuration/settings/new',
    edit: '/dashboard/configuration/settings'
  }
}

export type SettingFormConfig = typeof settingFormConfig
