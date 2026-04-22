import { FormConfig } from '../FormView/FormView'
import type { User } from '@/lib/drizzle/server'

export const customerFormConfig: FormConfig = {
  entityName: 'Customer',
  entityNamePlural: 'Customers',
  apiEndpoint: '/api/customers',
  fields: [
    // Basic Information Section
    {
      key: 'avatar',
      label: 'Profile Photo',
      type: 'file',
      required: false,
      gridCols: 1
    },
    {
      key: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      placeholder: 'Enter customer full name',
      validation: (value) => {
        if (!value || value.trim().length < 2) return 'Name must be at least 2 characters'
        if (!/^[a-zA-Z\s]+$/.test(value.trim())) return 'Name can only contain letters and spaces'
        return null
      },
      gridCols: 2
    },
    {
      key: 'email',
      label: 'Email Address',
      type: 'text',
      required: true,
      placeholder: 'customer@example.com',
      validation: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Please enter a valid email address'
        return null
      },
      gridCols: 2
    },
    {
      key: 'phone',
      label: 'Phone Number',
      type: 'text',
      required: false,
      placeholder: '+1 (555) 123-4567',
      validation: (value) => {
        if (value && !/^\+?[\d\s-()]+$/.test(value)) return 'Please enter a valid phone number'
        return null
      },
      gridCols: 2
    },
    {
      key: 'company',
      label: 'Company',
      type: 'text',
      required: false,
      placeholder: 'Company name',
      gridCols: 2
    },
    {
      key: 'job_title',
      label: 'Job Title',
      type: 'text',
      required: false,
      placeholder: 'Job title or position',
      gridCols: 2
    },
    
    // Address Section
    {
      key: 'address',
      label: 'Street Address',
      type: 'text',
      required: false,
      placeholder: 'Enter street address',
      gridCols: 1
    },
    {
      key: 'city',
      label: 'City',
      type: 'text',
      required: false,
      placeholder: 'City',
      gridCols: 3
    },
    {
      key: 'state',
      label: 'State/Province',
      type: 'text',
      required: false,
      placeholder: 'State or province',
      gridCols: 3
    },
    {
      key: 'zip_code',
      label: 'ZIP/Postal Code',
      type: 'text',
      required: false,
      placeholder: '12345',
      validation: (value) => {
        if (value && !/^\d{5}(-\d{4})?$/.test(value)) return 'Please enter a valid ZIP code'
        return null
      },
      gridCols: 3
    },
    {
      key: 'country',
      label: 'Country',
      type: 'select',
      required: false,
      placeholder: 'Select country',
      options: [
        { label: 'United States', value: 'US' },
        { label: 'Canada', value: 'CA' },
        { label: 'United Kingdom', value: 'UK' },
        { label: 'Australia', value: 'AU' },
        { label: 'Germany', value: 'DE' },
        { label: 'France', value: 'FR' },
        { label: 'Japan', value: 'JP' },
        { label: 'China', value: 'CN' },
        { label: 'India', value: 'IN' },
        { label: 'Brazil', value: 'BR' },
        { label: 'Mexico', value: 'MX' },
        { label: 'Spain', value: 'ES' },
        { label: 'Italy', value: 'IT' }
      ],
      gridCols: 3
    },
    
    // Additional Information Section
    {
      key: 'website',
      label: 'Website',
      type: 'text',
      required: false,
      placeholder: 'https://example.com',
      validation: (value) => {
        if (value && !/^https?:\/\/.+/.test(value)) return 'Please enter a valid website URL'
        return null
      },
      gridCols: 2
    },
    {
      key: 'birthday',
      label: 'Birthday',
      type: 'text',
      required: false,
      placeholder: 'YYYY-MM-DD',
      validation: (value) => {
        if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'Please enter a valid date (YYYY-MM-DD)'
        return null
      },
      gridCols: 2
    },
    {
      key: 'gender',
      label: 'Gender',
      type: 'select',
      required: false,
      placeholder: 'Select gender',
      options: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
        { label: 'Other', value: 'other' },
        { label: 'Prefer not to say', value: 'not_specified' }
      ],
      gridCols: 2
    },
    {
      key: 'notes',
      label: 'Notes & Comments',
      type: 'textarea',
      required: false,
      placeholder: 'Additional notes, preferences, or comments about the customer',
      rows: 4,
      gridCols: 1
    }
  ],
  actions: {
    print: true,
    export: true,
    duplicate: false, // Usually don't duplicate customers
    copy: true,
    archive: true,
    delete: true
  },
  breadcrumbs: {
    base: '/admin',
    list: '/admin/customers',
    create: '/admin/customers/new',
    edit: '/admin/customers'
  }
}

export type CustomerFormConfig = typeof customerFormConfig
