import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const staffFormConfig: FormConfig = {
  entityName: 'Staff Account',
  entityNamePlural: 'Staff Accounts',
  apiEndpoint: '/api/admin/staff-accounts',
  fields: [
    {
      key: 'full_name',
      label: 'Full Name',
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
      key: 'shop_id',
      label: 'Shop',
      type: 'many2one',
      fetchUrl: '/api/admin/shops',
      required: true,
      placeholder: 'Select shop',
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
      key: 'is_owner',
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
    base: '/admin',
    list: '/admin/configuration/users',
    create: '/admin/configuration/users/new',
    edit: '/admin/configuration/users'
  }
}

export type StaffFormConfig = typeof staffFormConfig
