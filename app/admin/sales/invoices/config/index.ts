// Export all invoice view configurations
export { invoiceFormConfig, type InvoiceFormConfig } from './formView'
export { invoiceListConfig, type InvoiceListConfig } from './listView'

import { invoiceFormConfig } from './formView'
import { invoiceListConfig } from './listView'
import { ServerActionConfig } from '@/components/Base/Actions'
import { FileText, Download, Printer } from 'lucide-react'
import { createElement } from 'react'

// Centralized invoice config - Odoo-like architecture
export const invoiceConfig = {
  entityName: 'Invoice',
  entityNamePlural: 'Invoices',
  apiEndpoint: '/api/admin/sales/invoices',

  // Default action flags - built-in actions enabled by default
  defaultActions: {
    print: true,
    exportExcel: true,
    delete: true,
    duplicate: false,
    copyJson: true,
    archive: true,
    unarchive: true,
  },

  // Custom ServerActions - additional actions beyond defaults
  customServerActions: [
    {
      key: 'download_pdf',
      label: 'Download PDF',
      icon: createElement(Download, { size: 16 }),
      color: 'blue' as const,
      mode: 'both' as const,
      helper: 'Download invoice as PDF',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('Download PDF for:', record)
        alert('Download PDF functionality - Coming soon!')
      }
    },
    {
      key: 'print_invoice',
      label: 'Print',
      icon: createElement(Printer, { size: 16 }),
      color: 'violet' as const,
      mode: 'both' as const,
      helper: 'Print the invoice',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('Print invoice:', record)
        alert('Print invoice functionality - Coming soon!')
      }
    },
    {
      key: 'send_invoice',
      label: 'Send to Customer',
      icon: createElement(FileText, { size: 16 }),
      color: 'green' as const,
      mode: 'edit' as const,
      helper: 'Email invoice to customer',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('Send invoice to:', record)
        alert('Send invoice functionality - Coming soon!')
      }
    }
  ] as ServerActionConfig[],

  // View-specific configs (without actions)
  listViewConfig: (data: any[] = []) => ({
    ...invoiceListConfig,
    data: data || []
  }),
  formViewConfig: invoiceFormConfig,
}

// Helper to get all configs for a model (legacy support)
export const getInvoiceConfigs = (data: any[] = []) => ({
  formView: invoiceFormConfig,
  listView: { ...invoiceListConfig, data: data || [] },
})
