import { FormConfig } from '@/components/admin/ResourceView/FormView'

export const announcementFormConfig: FormConfig = {
  entityName: 'Announcement',
  entityNamePlural: 'Announcements',
  apiEndpoint: '/api/announcements',
  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'text',
      required: true,
      placeholder: 'announcement-001',
      gridCols: 1,
      gridRow: 1,
      gridColumn: 1,
      order: 1
    },
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Enter announcement title',
      gridCols: 2,
      gridRow: 1,
      gridColumn: 2,
      order: 2
    },
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      required: true,
      options: [
        { value: 'info', label: 'Info' },
        { value: 'success', label: 'Success' },
        { value: 'warning', label: 'Warning' },
        { value: 'error', label: 'Error' }
      ],
      gridCols: 1,
      gridRow: 2,
      gridColumn: 1,
      order: 3
    },
    {
      key: 'active',
      label: 'Active',
      type: 'toggle',
      required: false,
      gridCols: 1,
      gridRow: 2,
      gridColumn: 2,
      order: 4
    },
    {
      key: 'content',
      label: 'Content',
      type: 'textarea',
      required: true,
      placeholder: 'Enter announcement content',
      gridCols: 2,
      gridRow: 3,
      gridColumn: 1,
      order: 5
    },
    {
      key: 'start_date',
      label: 'Start Date',
      type: 'date',
      required: false,
      placeholder: 'YYYY-MM-DD',
      helper: 'When the announcement becomes active',
      gridCols: 1,
      gridRow: 4,
      gridColumn: 1,
      order: 6
    },
    {
      key: 'end_date',
      label: 'End Date',
      type: 'date',
      required: false,
      placeholder: 'YYYY-MM-DD',
      helper: 'When the announcement expires',
      gridCols: 1,
      gridRow: 4,
      gridColumn: 2,
      order: 7
    }
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/announcements',
    create: '/admin/announcements/new',
    edit: '/admin/announcements'
  }
}

export type AnnouncementFormConfig = typeof announcementFormConfig
