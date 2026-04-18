'use client'

import { FormView } from '@/components/admin/FormView'
import { productFormConfig } from '@/components/admin/form-configs/productConfig'

export default function NewProductPage() {
    return (
        <FormView 
            mode="create" 
            config={productFormConfig}
        />
    )
}
