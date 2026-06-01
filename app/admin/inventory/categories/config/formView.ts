import { FormConfig } from '@/components/Base/Views/FormView'

export const categoryFormConfig: FormConfig = {
  entityName: 'Category',
  entityNamePlural: 'Categories',
  apiEndpoint: '/api/admin/categories',
  fields: [
    {
      key: 'name',
      label: 'Name',
      type: 'string',
      required: true,
      placeholder: 'Category name',
      columnWidth: 2,
      groupNumber: 1,
      groupColumn: 1,
      order: 1
    },
    {
      key: 'slug',
      label: 'Slug',
      type: 'string',
      required: true,
      placeholder: 'category-slug',
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 2,
      order: 2
    },
    {
      key: 'description',
      label: 'Description',
      type: 'html',
      required: false,
      placeholder: 'Enter category description',
      columnWidth: 3,
      groupNumber: 3,
      groupColumn: 1,
      order: 3
    },
    {
      key: 'parent_id',
      label: 'Parent Category',
      type: 'many2one',
      fetchUrl: '/api/admin/categories',
      required: false,
      placeholder: 'Select parent category',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 1,
      order: 4
    },
    {
      key: 'position',
      label: 'Position ( Optional )',
      type: 'number',
      required: false,
      placeholder: '0',
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 2,
      order: 5
    },
    {
      key: 'active',
      label: 'Active',
      type: 'boolean',
      required: false,
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 3,
      order: 6
    },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/inventory/categories',
    create: '/admin/inventory/categories/new',
    edit: '/admin/inventory/categories'
  }
}
