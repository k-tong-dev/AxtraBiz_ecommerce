import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const pageFormConfig: FormConfig = {
  entityName: 'Page',
  entityNamePlural: 'Pages',
  apiEndpoint: '/api/admin/pages',
  fields: [
    { key: 'title', label: 'Title', type: 'string', required: true, placeholder: 'About Us', columnWidth: 2, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'slug', label: 'Slug', type: 'string', required: true, placeholder: 'about-us', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 1 },
    { key: 'meta_title', label: 'Meta Title', type: 'string', placeholder: 'SEO title...', columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 2 },
    { key: 'meta_description', label: 'Meta Description', type: 'string', placeholder: 'SEO description...', columnWidth: 2, groupNumber: 1, groupColumn: 2, order: 3 },
    { key: 'status', label: 'Status', type: 'selection', required: true, options: [{ value: 'draft', label: 'Draft' }, { value: 'published', label: 'Published' }], columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'published_at', label: 'Published At', type: 'datetime', columnWidth: 1, groupNumber: 2, groupColumn: 2, order: 1 },
    { key: 'content', label: 'Content', type: 'html', placeholder: 'Page content...', columnWidth: 3, groupNumber: 3, groupColumn: 1, order: 0 },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/content/pages',
    create: '/admin/content/pages/new',
    edit: '/admin/content/pages'
  }
}
export type PageFormConfig = typeof pageFormConfig
