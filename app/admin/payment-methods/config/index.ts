export { paymentMethodFormConfig } from './formView'
export { paymentMethodListConfig, type PaymentMethodListConfig } from './listView'

import { paymentMethodFormConfig } from './formView'
import { paymentMethodListConfig } from './listView'

export const paymentMethodConfig = {
  entityName: 'Payment Method',
  entityNamePlural: 'Payment Methods',
  apiEndpoint: '/api/admin/payment-methods',
  defaultActions: {
    print: true, exportExcel: true, delete: true,
    duplicate: true, copyJson: true, archive: true, unarchive: true,
  },
  listViewConfig: (data: any[] = []) => ({
    ...paymentMethodListConfig,
    data: data || []
  }),
  formViewConfig: paymentMethodFormConfig,
}
