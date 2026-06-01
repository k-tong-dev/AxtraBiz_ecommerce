export { paymentTransactionFormConfig, type PaymentTransactionFormConfig } from './formView'
export { paymentTransactionListConfig, type PaymentTransactionListConfig } from './listView'

import { paymentTransactionFormConfig } from './formView'
import { paymentTransactionListConfig } from './listView'

export const paymentTransactionConfig = {
  entityName: 'Payment Transaction',
  entityNamePlural: 'Payment Transactions',
  apiEndpoint: '/api/admin/payment-transactions',
  defaultActions: {
    print: true,
    exportExcel: true,
    delete: true,
    duplicate: false,
    copyJson: true,
    archive: true,
    unarchive: true,
  },
  customServerActions: [],
  listViewConfig: (data: any[] = []) => ({
    ...paymentTransactionListConfig,
    data: data || []
  }),
  formViewConfig: paymentTransactionFormConfig,
}

export const getPaymentTransactionConfigs = (data: any[] = []) => ({
  formView: paymentTransactionFormConfig,
  listView: { ...paymentTransactionListConfig, data: data || [] },
})
