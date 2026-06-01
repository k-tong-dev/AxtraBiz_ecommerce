import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const brandFormConfig: FormConfig = {
  entityName: 'Brand',
  entityNamePlural: 'Brands',
  apiEndpoint: '/api/admin/brands',
  fields: [
    {
      key: 'image_id',
      label: 'Logo',
      type: 'file',
      accept: 'image/*',
      maxFiles: 1,
      uploadText: 'Click to upload brand logo',
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
      placeholder: 'Brand name',
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
      placeholder: 'brand-slug',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 2,
      order: 1
    },
    {
      key: 'website',
      label: 'Website',
      type: 'string',
      placeholder: 'https://example.com',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 1,
      order: 2
    },
    {
      key: 'active',
      label: 'Active',
      type: 'boolean',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 2,
      order: 3
    },
    {
      key: 'description',
      label: 'Description',
      type: 'html',
      placeholder: 'Brand description...',
      columnWidth: 3,
      groupNumber: 3,
      groupColumn: 1,
      order: 0
    }
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/inventory/brands',
    create: '/admin/inventory/brands/new',
    edit: '/admin/inventory/brands'
  }
}

export type BrandFormConfig = typeof brandFormConfig
