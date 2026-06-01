import type { FormConfig } from '@/components/Base/Views/FormView/FormView'

export const couponFormConfig: FormConfig = {
  entityName: 'Coupon',
  entityNamePlural: 'Coupons',
  apiEndpoint: '/api/admin/coupons',
  fields: [
    { key: 'code', label: 'Code', type: 'string', required: true, placeholder: 'SUMMER25', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 0 },
    { key: 'type', label: 'Type', type: 'selection', required: true, options: [{ value: 'percentage', label: 'Percentage' }, { value: 'fixed_amount', label: 'Fixed Amount' }, { value: 'free_shipping', label: 'Free Shipping' }, { value: 'buy_x_get_y', label: 'Buy X Get Y' }], columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 1 },
    { key: 'value', label: 'Value', type: 'number', placeholder: '25.00', columnWidth: 1, groupNumber: 1, groupColumn: 1, order: 2 },
    { key: 'min_order_amount', label: 'Min Order Amount', type: 'number', placeholder: '0.00', columnWidth: 1, groupNumber: 1, groupColumn: 2, order: 3 },
    { key: 'max_uses', label: 'Max Uses', type: 'number', placeholder: '100', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 0 },
    { key: 'used_count', label: 'Used Count', type: 'number', placeholder: '0', columnWidth: 1, groupNumber: 2, groupColumn: 2, order: 1 },
    { key: 'starts_at', label: 'Start Date', type: 'datetime', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 2 },
    { key: 'expires_at', label: 'Expiry Date', type: 'datetime', columnWidth: 1, groupNumber: 2, groupColumn: 2, order: 3 },
    { key: 'active', label: 'Active', type: 'boolean', columnWidth: 1, groupNumber: 2, groupColumn: 1, order: 4 },
    { key: 'description', label: 'Description', type: 'html', placeholder: 'Coupon description...', columnWidth: 3, groupNumber: 3, groupColumn: 1, order: 0 },
  ],
  breadcrumbs: {
    base: '/admin',
    list: '/admin/marketing/coupons',
    create: '/admin/marketing/coupons/new',
    edit: '/admin/marketing/coupons'
  }
}
export type CouponFormConfig = typeof couponFormConfig
