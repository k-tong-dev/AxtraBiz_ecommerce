import { FormConfig } from '@/components/admin/ResourceView/FormView'

export const customerFormConfig: FormConfig = {
  entityName: 'Customer',
  entityNamePlural: 'Customers',
  apiEndpoint: '/api/users',
  fields: [
    {
      key: 'id',
      label: 'Customer ID',
      type: 'text',
      required: true,
      placeholder: 'user-001',
      gridCols: 1,
      gridRow: 1,
      gridColumn: 1,
      order: 1
    },
    {
      key: 'email',
      label: 'Email',
      type: 'text',
      required: true,
      placeholder: 'customer@example.com',
      gridCols: 1,
      gridRow: 1,
      gridColumn: 2,
      order: 2
    },
    {
      key: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'John Doe',
      gridCols: 2,
      gridRow: 2,
      gridColumn: 1,
      order: 3
    },
    {
      key: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { value: 'customer', label: 'Customer' },
        { value: 'admin', label: 'Admin' }
      ],
      gridCols: 1,
      gridRow: 3,
      gridColumn: 1,
      order: 4
    },
    {
      key: 'active',
      label: 'Active',
      type: 'toggle',
      required: false,
      gridCols: 1,
      gridRow: 3,
      gridColumn: 2,
      order: 5
    }
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/customers',
    create: '/admin/customers/new',
    edit: '/admin/customers'
  }
}

export type CustomerFormConfig = typeof customerFormConfig
