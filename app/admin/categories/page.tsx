'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { ProductCategory } from '@/lib/drizzle/server'
import { showToast } from '@/lib/ui/toast'
import { ResourceView } from '@/components/Base/Views'
import { categoryConfig } from './config'

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [loading, setLoading] = useState(true)

  const fetchedRef = useRef(false)

  const loadCategories = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/categories')
      const all = await response.json()
      setCategories(all)
      setLoading(false)
      if (all.length === 0) {
        showToast('info', 'No categories found', 'Your categories table is empty. Create your first category.')
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      showToast('error', 'Error', 'Failed to load categories')
      setLoading(false)
    }
  }, [])

  const refresh = useCallback(() => {
    fetchedRef.current = false
    loadCategories()
  }, [loadCategories])

  useEffect(() => {
    if (fetchedRef.current) return
    fetchedRef.current = true
    loadCategories()
  }, [loadCategories])

  const openCreate = () => router.push('/admin/categories/new')

  const openEdit = (cat: ProductCategory) => router.push(`/admin/categories/${cat.id}/edit`)

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this category?')
    if (!ok) return

    try {
      setCategories((prev) => prev.filter((c) => String(c.id) !== id))
      const response = await fetch(`/api/admin/categories?id=${id}`, { method: 'DELETE' })
      const result = await response.json()
      if (result.success) {
        showToast('success', 'Category deleted', 'The category was removed successfully.')
      } else {
        showToast('error', 'Delete failed', 'The category was removed from the UI, but delete did not succeed.')
      }
    } catch (error) {
      showToast('error', 'Delete failed', 'The category was removed from the UI, but delete did not succeed.')
      console.error('Delete error:', error)
    }
  }

  const handleRowClick = (rowData: ProductCategory) => openEdit(rowData)

  const config = categoryConfig.listViewConfig(categories)

  return (
    <ResourceView
      config={{
        type: 'list',
        title: 'Categories',
        description: 'Create, edit, and manage product categories.',
        listViewConfig: config,
        formViewConfig: categoryConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: categoryConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => remove(rowData.id)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    />
  )
}
