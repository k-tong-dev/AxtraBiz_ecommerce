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
      columnWidth: 1,
      groupNumber: 1,
      groupColumn: 1,
      order: 1
    },
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      placeholder: 'Enter announcement title',
      columnWidth: 2,
      groupNumber: 1,
      groupColumn: 2,
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
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 1,
      order: 3
    },
    {
      key: 'active',
      label: 'Active',
      type: 'toggle',
      required: false,
      columnWidth: 1,
      groupNumber: 2,
      groupColumn: 2,
      order: 4
    },
    {
      key: 'content',
      label: 'Content',
      type: 'textarea',
      required: true,
      placeholder: 'Enter announcement content',
      columnWidth: 2,
      groupNumber: 3,
      groupColumn: 1,
      order: 5
    },
    {
      key: 'start_date',
      label: 'Start Date',
      type: 'date',
      required: false,
      placeholder: 'YYYY-MM-DD',
      helper: 'When the announcement becomes active',
      columnWidth: 1,
      groupNumber: 4,
      groupColumn: 1,
      order: 6
    },
    {
      key: 'end_date',
      label: 'End Date',
      type: 'date',
      required: false,
      placeholder: 'YYYY-MM-DD',
      helper: 'When the announcement expires',
      columnWidth: 1,
      groupNumber: 4,
      groupColumn: 2,
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
