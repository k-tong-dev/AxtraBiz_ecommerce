'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ResourceView } from '@/components/Base/Views'
import { categoryConfig } from '../../config'
import type { ProductCategory } from '@/lib/drizzle/server'

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id as string
  const fetchedRef = useRef(false)

  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState<ProductCategory | null>(null)

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true

    const load = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}`)
        if (response.ok) {
          const data = await response.json()
          setCategory(data)
        } else {
          router.push('/admin/categories')
        }
      } catch {
        router.push('/admin/categories')
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) load()
  }, [categoryId, router])

  return (
    <ResourceView
      config={{
        type: 'form',
        title: `${category?.name || 'Error'}`,
        description: 'Edit category details.',
        formViewConfig: categoryConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: categoryConfig.defaultActions,
      }}
      entityId={categoryId}
      initialData={category}
    />
  )
}
