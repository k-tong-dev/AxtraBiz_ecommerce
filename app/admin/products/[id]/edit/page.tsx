'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { FormView } from '@/components/admin/FormView'
import { productFormConfig } from '@/components/admin/form-configs/productConfig'
import type { Product } from '@/lib/drizzle/server'

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const productId = params.id as string

    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState<Product | null>(null)

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`)
                if (response.ok) {
                    const data = await response.json()
                    setProduct(data)
                } else {
                    router.push('/admin/products')
                }
            } catch (error) {
                router.push('/admin/products')
            } finally {
                setLoading(false)
            }
        }

        if (productId) {
            loadProduct()
        }
    }, [productId, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Loading product...</div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-lg">Product not found</div>
            </div>
        )
    }

    return (
        <FormView 
            mode="edit" 
            config={productFormConfig}
            initialData={product}
            entityId={productId}
        />
    )
}
