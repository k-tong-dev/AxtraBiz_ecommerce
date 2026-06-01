import { FormConfig } from '@/components/Base/Views/FormView'

export const customerFormConfig: FormConfig = {
  entityName: 'Customer',
  entityNamePlural: 'Customers',
  apiEndpoint: '/api/admin/users',
  fields: [
    {
      key: 'id',
      label: 'Customer ID',
      type: 'string',
      required: true,
      placeholder: 'user-001',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 1,
      order: 1
    },
    {
      key: 'email',
      label: 'Email',
      type: 'string',
      required: true,
      placeholder: 'customer@example.com',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 2,
      order: 2
    },
    {
      key: 'name',
      label: 'Full Name',
      type: 'string',
      required: true,
      placeholder: 'John Doe',
      columnWidth: 2,
      groupNumber: 2,
      groupColumn: 1,
      order: 3
    },
    {
      key: 'role',
      label: 'Role',
      type: 'selection',
      required: true,
      options: [
        { value: 'customer', label: 'Customer' },
        { value: 'admin', label: 'Admin' },
        { value: 'staff', label: 'Staff' },
        { value: 'manager', label: 'Manager' }
      ],
      columnWidth: 1,
      groupNumber: 3,
      groupColumn: 1,
      order: 4
    },
    {
      key: 'active',
      label: 'Active',
      type: 'toggle',
      required: false,
      columnWidth: 1,
      groupNumber: 3,
      groupColumn: 2,
      order: 5
    }
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/customers/dashboard',
    create: '/admin/customers/dashboard/new',
    edit: '/admin/customers/dashboard'
  }
}

export type CustomerFormConfig = typeof customerFormConfig
