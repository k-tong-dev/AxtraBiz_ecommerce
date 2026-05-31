export { addressFormConfig } from './formView'
export { addressListConfig, type AddressListConfig } from './listView'

import { addressFormConfig } from './formView'
import { addressListConfig } from './listView'

export const addressConfig = {
  entityName: 'Address',
  entityNamePlural: 'Addresses',
  apiEndpoint: '/api/admin/addresses',
  defaultActions: {
    print: true, exportExcel: true, delete: true,
    duplicate: true, copyJson: true, archive: true, unarchive: true,
  },
  listViewConfig: (data: any[] = []) => ({
    ...addressListConfig,
    data: data || []
  }),
  formViewConfig: addressFormConfig,
}
