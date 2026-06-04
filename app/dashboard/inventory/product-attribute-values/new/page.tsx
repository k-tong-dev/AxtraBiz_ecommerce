'use client'

import { ResourceView } from '@/components/Base/Views'
import { productAttributeValueConfig } from '../config'

export default function NewProductAttributeValuePage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Product Attribute Value',
                description: 'Create a new product attribute value.',
                formViewConfig: productAttributeValueConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: productAttributeValueConfig.defaultActions,
                serverActions: productAttributeValueConfig.customServerActions,
            }}
        />
    )
}
