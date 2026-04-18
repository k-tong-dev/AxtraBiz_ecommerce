import { notFound } from 'next/navigation'
import { AdminResourceFormPage } from '@/components/admin/resource-form-page'
import type { AdminResource } from '@/lib/admin-resource-config'

const allowedResources: AdminResource[] = [
  'products',
  'orders',
  'customers',
  'invoices',
  'announcements',
  'settings',
  'configurations',
]

export default async function AdminCreateResourcePage({
  params,
}: {
  params: Promise<{ resource: string }>
}) {
  const { resource } = await params
  if (!allowedResources.includes(resource as AdminResource)) notFound()

  return <AdminResourceFormPage resource={resource as AdminResource} mode="create" />
}

