'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ResourceView } from '../../../../../components/Base/Views'
import { productAttributeConfig } from '../../config'
import type { ProductAttribute } from '@/lib/drizzle/server'

export default function EditProductAttributePage() {
    const router = useRouter()
    const params = useParams()
    const attributeId = params.id as string

    const [loading, setLoading] = useState(true)
    const [attribute, setAttribute] = useState<ProductAttribute | null>(null)

    useEffect(() => {
        const loadAttribute = async () => {
            console.log('EditPage loading attributeId:', attributeId)
            try {
                const response = await fetch(`/api/admin/product-attributes/${attributeId}`)
                console.log('EditPage API response:', response.status, response.ok)
                if (response.ok) {
                    const data = await response.json()
                    console.log('EditPage loaded data:', data)
                    setAttribute(data)
                } else {
                    console.log('EditPage API failed, redirecting back')
                    router.push('/admin/product-attributes')
                }
            } catch (error) {
                console.log('EditPage error:', error)
                router.push('/admin/product-attributes')
            } finally {
                setLoading(false)
            }
        }

        if (attributeId) {
            loadAttribute()
        }
    }, [attributeId, router])

    return (
        <ResourceView
            config={{
                type: 'form',
                title: 'Edit Product Attribute',
                description: 'Edit product attribute details.',
                formViewConfig: productAttributeConfig.formViewConfig,
                enableDefaultActions: true,
                defaultActions: productAttributeConfig.defaultActions,
                serverActions: productAttributeConfig.customServerActions,
            }}
            entityId={attributeId}
            initialData={attribute}
        />
    )
}
