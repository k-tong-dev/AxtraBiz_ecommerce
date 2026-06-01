export { productReviewFormConfig } from './formView'
export { productReviewListConfig, type ProductReviewListConfig } from './listView'

import { productReviewFormConfig } from './formView'
import { productReviewListConfig } from './listView'

export const productReviewConfig = {
  entityName: 'Product Review',
  entityNamePlural: 'Product Reviews',
  apiEndpoint: '/api/admin/marketing/product-reviews',
  defaultActions: {
    print: true, exportExcel: true, delete: true,
    duplicate: true, copyJson: true, archive: true, unarchive: true,
  },
  listViewConfig: (data: any[] = []) => ({
    ...productReviewListConfig,
    data: data || []
  }),
  formViewConfig: productReviewFormConfig,
}
