export { couponFormConfig } from './formView'
export { couponListConfig, type CouponListConfig } from './listView'

import { couponFormConfig } from './formView'
import { couponListConfig } from './listView'

export const couponConfig = {
  entityName: 'Coupon',
  entityNamePlural: 'Coupons',
  apiEndpoint: '/api/admin/marketing/coupons',
  defaultActions: {
    print: true, exportExcel: true, delete: true,
    duplicate: true, copyJson: true, archive: true, unarchive: true,
  },
  listViewConfig: (data: any[] = []) => ({
    ...couponListConfig,
    data: data || []
  }),
  formViewConfig: couponFormConfig,
}
