'use client'

import { ResourceView } from '../../../../components/Base/Views'
import { invoiceConfig } from '../config'

export default function NewInvoicePage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Invoice',
                description: 'Create a new invoice.',
                formViewConfig: invoiceConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: invoiceConfig.defaultActions,
                serverActions: invoiceConfig.customServerActions,
            }}
        />
    )
}
