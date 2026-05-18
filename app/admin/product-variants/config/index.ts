// Export all product variant view configurations
export { productVariantFormConfig, type ProductVariantFormConfig } from './formView'
export { productVariantListConfig, type ProductVariantListConfig } from './listView'

import { productVariantFormConfig } from './formView'
import { productVariantListConfig } from './listView'
import { ServerActionConfig } from '../../../../components/Base/Actions'
import { Layers, Copy } from 'lucide-react'
import { createElement } from 'react'

// Centralized product variant config - Odoo-like architecture
export const productVariantConfig = {
  entityName: 'Product Variant',
  entityNamePlural: 'Product Variants',
  apiEndpoint: '/api/admin/product-variants',

  // Default action flags - built-in actions enabled by default
  defaultActions: {
    print: true,
    exportExcel: true,
    delete: true,
    duplicate: true,
    copyJson: true,
  },

  // Custom ServerActions - additional actions beyond defaults
  customServerActions: [
    {
      key: 'duplicate_variant',
      label: 'Duplicate Variant',
      icon: createElement(Copy, { size: 16 }),
      color: 'blue' as const,
      mode: 'edit' as const,
      helper: 'Duplicate this product variant',
      onClick: async (data: any[], context?: any) => {
        const record = context?.record || data[0]
        console.log('Duplicate Variant for:', record)
        alert('Duplicate Variant functionality - Coming soon!')
      }
    }
  ] as ServerActionConfig[],

  // View-specific configs (without actions)
  listViewConfig: (data: any[] = []) => ({
    ...productVariantListConfig,
    data: data || []
  }),
  formViewConfig: productVariantFormConfig,
}

// Helper to get all configs for a model (legacy support)
export const getProductVariantConfigs = (data: any[] = []) => ({
  formView: productVariantFormConfig,
  listView: { ...productVariantListConfig, data: data || [] },
})
