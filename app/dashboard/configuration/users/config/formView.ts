import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const staffFormConfig: FormConfig = {
  entityName: 'Users',
  entityNamePlural: 'Users',
  apiEndpoint: '/api/dashboard/users',
  fields: [
    {
      key: 'username',
      label: 'Username',
      type: 'string',
      required: true,
      placeholder: 'John Doe',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 1,
      order: 0
    },
    {
      key: 'email',
      label: 'Email',
      type: 'string',
      required: true,
      placeholder: 'staff@example.com',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 2,
      order: 1
    },
    {
      key: 'shopId',
      label: 'Shops',
      type: 'many2many',
      fetchUrl: '/api/dashboard/shops',
      placeholder: 'Select shops',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 1,
      order: 2
    },
    {
      key: 'status',
      label: 'Status',
      type: 'selection',
      required: true,
      options: [
        { value: 'active', label: 'Active' },
        { value: 'invited', label: 'Invited' },
        { value: 'disabled', label: 'Disabled' }
      ],
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 2,
      order: 3
    },
    {
      key: 'isShopOwner',
      label: 'Is Owner',
      type: 'boolean',
      columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 4
    },
    {
      key: 'password',
      label: 'Initial Password',
      type: 'string',
      placeholder: 'Set password to allow login (create only)',
      columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 5
    },
  ],
  breadcrumbs: {
    base: '/dashboard',
    list: '/dashboard/configuration/users',
    create: '/dashboard/configuration/users/new',
    edit: '/dashboard/configuration/users'
  }
}

export type StaffFormConfig = typeof staffFormConfig
