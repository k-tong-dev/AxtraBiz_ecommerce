import { FormConfig } from '@/components/admin/ResourceView/FormView'

export const settingFormConfig: FormConfig = {
  entityName: 'Setting',
  entityNamePlural: 'Settings',
  apiEndpoint: '/api/settings',
  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'text',
      required: true,
      placeholder: 'setting-001',
      gridCols: 1,
      gridRow: 1,
      gridColumn: 1,
      order: 1
    },
    {
      key: 'key',
      label: 'Key',
      type: 'text',
      required: true,
      placeholder: 'site_name',
      gridCols: 1,
      gridRow: 1,
      gridColumn: 2,
      order: 2
    },
    {
      key: 'category',
      label: 'Category',
      type: 'text',
      required: true,
      placeholder: 'general',
      gridCols: 1,
      gridRow: 2,
      gridColumn: 1,
      order: 3
    },
    {
      key: 'value',
      label: 'Value',
      type: 'textarea',
      required: true,
      placeholder: 'Setting value',
      gridCols: 2,
      gridRow: 3,
      gridColumn: 1,
      order: 4
    }
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/settings',
    create: '/admin/settings/new',
    edit: '/admin/settings'
  }
}

export type SettingFormConfig = typeof settingFormConfig
