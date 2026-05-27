'use client'

import { ResourceView } from '@/components/Base/Views'
import { productConfig } from '../config'

export default function NewProductPage() {
    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'New Product',
                description: 'Create a new product.',
                formViewConfig: productConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: productConfig.defaultActions,
                serverActions: productConfig.customServerActions,
            }}
        />
    )
}
