import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const shopFormConfig: FormConfig = {
  entityName: 'Shop',
  entityNamePlural: 'Shops',
  apiEndpoint: '/api/admin/shops',
  fields: [
    {
      key: 'logo',
      label: 'Logo',
      type: 'file',
      accept: 'image/*',
      maxFiles: 1,
      uploadText: 'Click to upload shop logo',
      columnWidth: 2,
      groupNumber: 1,
      groupColumn: 1,
      order: 0
    },
    {
      key: 'name',
      label: 'Name',
      type: 'string',
      required: true,
      placeholder: 'Shop name',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 1,
      order: 0
    },
    {
      key: 'slug',
      label: 'Slug',
      type: 'string',
      required: true,
      placeholder: 'shop-slug',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 2,
      order: 1
    },
    {
      key: 'domain',
      label: 'Domain',
      type: 'string',
      placeholder: 'shop.example.com',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 1,
      order: 2
    },
    {
      key: 'email',
      label: 'Email',
      type: 'string',
      placeholder: 'shop@example.com',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 2,
      order: 3
    },
    {
      key: 'phone',
      label: 'Phone',
      type: 'string',
      placeholder: '+1 (555) 123-4567',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 1,
      order: 4
    },
    {
      key: 'active',
      label: 'Active',
      type: 'boolean',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 2,
      order: 5
    },
    {
      key: 'address',
      label: 'Address',
      type: 'json',
      placeholder: '{"city": "New York", "country": "US"}',
      columnWidth: 3,
      groupNumber: 3,
      groupColumn: 1,
      order: 0
    }
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/configuration/shops',
    create: '/admin/configuration/shops/new',
    edit: '/admin/configuration/shops'
  }
}

export type ShopFormConfig = typeof shopFormConfig
