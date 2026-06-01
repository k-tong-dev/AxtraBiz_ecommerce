'use client'

import { useRouter } from 'next/navigation'
import { useResource } from '@/components/Base/Views/hooks/useResource'
import { ResourceView } from '@/components/Base/Views'
import { currencyConfig } from './config'
import { useConfirmDelete } from '@/components/Base/Views/hooks/useConfirmDelete'

export default function AdminCurrenciesPage() {
  const router = useRouter()
  const { data: currencies, loading, refresh } = useResource<any[]>('/api/admin/system/currencies')
  const { confirmDelete, deleteModal } = useConfirmDelete({ apiEndpoint: '/api/admin/system/currencies', entityName: 'currency', refresh, useQueryParam: false })

  const openCreate = () => router.push('/admin/system/currencies/new')
  const openEdit = (row: any) => router.push(`/admin/system/currencies/${row.code}/edit`)
  const handleRowClick = (rowData: any) => openEdit(rowData)

  const config = currencyConfig.listViewConfig(currencies ?? [])

  return (
    <>{deleteModal}<ResourceView
      config={{
        type: 'list',
        title: 'Currencies',
        description: 'Manage supported currencies and exchange rates.',
        listViewConfig: config,
        formViewConfig: currencyConfig.formViewConfig,
        enableDefaultActions: true,
        defaultActions: currencyConfig.defaultActions,
      }}
      onEdit={handleRowClick}
      onDelete={(rowData) => confirmDelete(rowData.code)}
      onCreate={openCreate}
      loading={loading}
      onRefresh={refresh}
    /></>
  )
}
