'use client'

import { FormView } from '@/components/admin/ResourceView/FormView'
import { productFormConfig } from '../config'

export default function NewProductPage() {
    return (
        <FormView 
            mode="create" 
            config={productFormConfig}
        />
    )
}
