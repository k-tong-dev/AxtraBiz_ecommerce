import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const staffFormConfig: FormConfig = {
  entityName: 'Users',
  entityNamePlural: 'Users',
  apiEndpoint: '/api/dashboard/users',
  fields: [
    {
      key: 'avatarUrl',
      label: 'Avatar',
      type: 'file',
      maxFiles: 1,
      accept: 'image/*',
      uploadText: 'Click to upload user avatar',
      required: false,
    },
    {
      key: 'displayName',
      label: 'Full Name',
      type: 'string',
      required: true,
      placeholder: 'John Doe',
      columnWidth: 2,
      groupNumber: 10,
      groupColumn: 1,
      order: 0
    },
    {
      key: 'isShopOwner',
      label: 'Is Shop Owner',
      type: 'boolean',
      columnWidth: 1,
      groupNumber: 10,
      groupColumn: 2,
      order: 1
    },
    {
      key: 'username',
      label: 'Username',
      type: 'string',
      required: true,
      placeholder: 'Example : john123',
      columnWidth: 2,
      groupNumber: 10,
      groupColumn: 2,
      order: 3
    },



    {
      key: 'active',
      label: 'Active',
      type: 'boolean',
      required: false,
      columnWidth: 1,
      groupNumber: 11,
      groupColumn: 1,
      order: 0
    },
    // {
    //   key: 'status',
    //   label: 'Status',
    //   type: 'selection',
    //   required: true,
    //   options: [
    //     { value: 'active', label: 'Active' },
    //     { value: 'invited', label: 'Invited' },
    //     { value: 'disabled', label: 'Disabled' }
    //   ],
    //   columnWidth: 1,
    //   groupNumber: 11,
    //   groupColumn: 2,
    //   order: 4
    // },

    {
      key: 'phone',
      label: 'Phone',
      type: 'number',
      placeholder: '+855 12 345 678',
      required: false,
      columnWidth: 1,
      groupNumber: 20,
      groupColumn: 2,
      order: 4
    },
    {
      key: 'mobile',
      label: 'Mobile',
      type: 'string',
      placeholder: '+855 12 345 678',
      required: false,
      columnWidth: 1,
      groupNumber: 20,
      groupColumn: 2,
      order: 5
    },

    {
      key: 'email',
      label: 'Email',
      type: 'string',
      required: true,
      placeholder: 'staff@example.com',
      columnWidth: 2,
      groupNumber: 30,
      groupColumn: 1,
      order: 1
    },
    {
      key: 'password',
      label: 'Password',
      type: 'string',
      placeholder: 'Set password to allow login (create only)',
      columnWidth: 1,
      groupNumber: 30,
      groupColumn: 2,
      order: 2
    },

    {
      key: 'shopId',
      label: 'Primary Shop',
      type: 'many2one',
      fetchUrl: '/api/dashboard/shops',
      placeholder: 'Select primary shop',
      columnWidth: 1,
      groupNumber: 40,
      groupColumn: 1,
      order: 0
    },
    {
      key: 'shop_ids',
      label: 'Allowed Shops',
      type: 'many2many',
      fetchUrl: '/api/dashboard/shops',
      placeholder: 'Select additional shops',
      columnWidth: 2,
      groupNumber: 40,
      groupColumn: 2,
      order: 1
    },
    {
      key: 'group_ids',
      label: 'User Groups',
      type: 'many2many',
      fetchUrl: '/api/dashboard/roles',
      placeholder: 'Select roles',
      columnWidth: 3,
      groupNumber: 50,
      groupColumn: 1,
      order: 0
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
