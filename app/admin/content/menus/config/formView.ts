import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const menuFormConfig: FormConfig = {
  entityName: 'Menu',
  entityNamePlural: 'Menus',
  apiEndpoint: '/api/admin/content/menus',
  fields: [
    { key: 'name', label: 'Name', type: 'string', required: true, columnWidth: 2, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'slug', label: 'Slug', type: 'string', required: true, columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 1 },
    { key: 'items', label: 'Menu Items', type: 'json', columnWidth: 3, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'active', label: 'Active', type: 'toggle', columnWidth: 1, groupNumber: 2, groupColumn: 2, order: 1 },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/content/menus',
    create: '/admin/content/menus/new',
    edit: '/admin/content/menus'
  }
}
export type MenuFormConfig = typeof menuFormConfig
