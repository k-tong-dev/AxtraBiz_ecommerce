'use client'

import React from 'react'
import { VariantManager } from '@/components/dashboard/VariantManager'

// Wrapper component for VariantManager to match FormPage interface
export function ProductVariantsPage({data, onDataChange}: {data: any; onDataChange: (data: any) => void}) {
    const [variants, setVariants] = React.useState<any[]>(data.variants || [])
    const [attributes, setAttributes] = React.useState<Array<{name: string, values: string[]}>>(data.attributes || [])

    const handleVariantsChange = (newVariants: any[]) => {
        setVariants(newVariants)
        onDataChange({...data, variants: newVariants})
    }

    const handleAttributesChange = (newAttributes: Array<{name: string, values: string[]}>) => {
        setAttributes(newAttributes)
        onDataChange({...data, attributes: newAttributes})
    }

    return (
        <VariantManager
            productType={data.product_type}
            variants={variants}
            attributes={attributes}
            onVariantsChange={handleVariantsChange}
            onAttributesChange={handleAttributesChange}
        />
    )
}
