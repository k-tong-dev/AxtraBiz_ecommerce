'use client'

import { ResourceView } from '../../../../components/Base/Views'
import { productAttributeConfig } from '../config'

export default function NewProductAttributePage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Product Attribute',
                description: 'Create a new product attribute.',
                formViewConfig: productAttributeConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: productAttributeConfig.defaultActions,
                serverActions: productAttributeConfig.customServerActions,
            }}
        />
    )
}
