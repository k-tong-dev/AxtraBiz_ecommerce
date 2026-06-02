'use client'

import { useState, useEffect, useCallback } from 'react'
import { ResourceView } from '@/components/Base/Views'
import type { CustomViewProps } from '@/components/Base/Views/types'
import { Table, Button, Modal, Input, Tag, Loader, Message, SelectPicker, IconButton, toaster, Notification } from 'rsuite'
import { Shield, Plus, Edit2, Trash2, RefreshCw, Play } from 'lucide-react'
import { ConfirmationModal } from '@/components/Base/Actions'

const { Column, HeaderCell, Cell } = Table

interface RlsPolicy {
  oid: number
  policyname: string
  tablename: string
  schemaname: string
  permissive: string
  roles: string[]
  cmd: string
  qual: string
  with_check: string
  enabled: boolean
}

interface TableInfo {
  tablename: string
  schemaname: string
  rls_enabled: boolean
}

function PolicyView({ loading: _loading, onRefresh }: CustomViewProps) {
  const [policies, setPolicies] = useState<RlsPolicy[]>([])
  const [tables, setTables] = useState<TableInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)

  const [policyModalOpen, setPolicyModalOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<RlsPolicy | null>(null)
  const [policyForm, setPolicyForm] = useState({
    tablename: '',
    policyname: '',
    cmd: 'SELECT',
    roles: 'public',
    qual: '',
    with_check: '',
  })

  const [confirmDelete, setConfirmDelete] = useState<{ message: string; onConfirm: () => void } | null>(null)
  const [executingSql, setExecutingSql] = useState(false)
  const [sqlModalOpen, setSqlModalOpen] = useState(false)
  const [sqlInput, setSqlInput] = useState('')

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [polRes, tabRes] = await Promise.all([
        fetch('/api/admin/policies'),
        fetch('/api/admin/policies/tables'),
      ])
      if (!polRes.ok || !tabRes.ok) throw new Error('Failed to fetch policy data')
      setPolicies(await polRes.json())
      setTables(await tabRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const filteredPolicies = selectedTable
    ? policies.filter(p => p.tablename === selectedTable)
    : policies

  const openCreatePolicy = (tableName?: string) => {
    setEditingPolicy(null)
    setPolicyForm({
      tablename: tableName || (tables[0]?.tablename || ''),
      policyname: '',
      cmd: 'SELECT',
      roles: 'public',
      qual: '',
      with_check: '',
    })
    setPolicyModalOpen(true)
  }

  const openEditPolicy = (policy: RlsPolicy) => {
    setEditingPolicy(policy)
    setPolicyForm({
      tablename: policy.tablename,
      policyname: policy.policyname,
      cmd: policy.cmd,
      roles: policy.roles.join(', '),
      qual: policy.qual || '',
      with_check: policy.with_check || '',
    })
    setPolicyModalOpen(true)
  }

  const savePolicy = async () => {
    if (!policyForm.policyname.trim() || !policyForm.tablename.trim()) return
    setExecutingSql(true)
    try {
      const cmd = editingPolicy ? 'ALTER' : 'CREATE'
      const roles = policyForm.roles === 'public' ? 'TO PUBLIC' : `TO (${policyForm.roles})`
      const qualClause = policyForm.qual ? `USING (${policyForm.qual})` : 'USING (true)'
      const checkClause = ['INSERT', 'UPDATE'].includes(policyForm.cmd) && policyForm.with_check
        ? `WITH CHECK (${policyForm.with_check})`
        : ''

      const sql = editingPolicy
        ? `DROP POLICY IF EXISTS "${policyForm.policyname}" ON "${policyForm.tablename}"; CREATE POLICY "${policyForm.policyname}" ON "${policyForm.tablename}" FOR ${policyForm.cmd} ${roles} ${qualClause} ${checkClause}`
        : `CREATE POLICY "${policyForm.policyname}" ON "${policyForm.tablename}" FOR ${policyForm.cmd} ${roles} ${qualClause} ${checkClause}`

      const res = await fetch('/api/admin/policies/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save policy')
      }
      toaster.push(<Notification type="success" header="Policy Saved">Policy has been applied successfully.</Notification>, { placement: 'topEnd' })
      setPolicyModalOpen(false)
      fetchData()
    } catch (err) {
      toaster.push(<Notification type="error" header="Error">{err instanceof Error ? err.message : 'Failed to save policy'}</Notification>, { placement: 'topEnd' })
    } finally {
      setExecutingSql(false)
    }
  }

  const deletePolicy = (policy: RlsPolicy) => {
    setConfirmDelete({
      message: `Are you sure you want to delete the policy "${policy.policyname}" on "${policy.tablename}"?`,
      onConfirm: async () => {
        try {
          const sql = `DROP POLICY IF EXISTS "${policy.policyname}" ON "${policy.tablename}"`
          const res = await fetch('/api/admin/policies/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sql }),
          })
          if (!res.ok) throw new Error('Failed to delete policy')
          toaster.push(<Notification type="success" header="Deleted">Policy removed successfully.</Notification>, { placement: 'topEnd' })
          fetchData()
        } catch (err) {
          toaster.push(<Notification type="error" header="Error">{err instanceof Error ? err.message : 'Failed to delete policy'}</Notification>, { placement: 'topEnd' })
        }
      },
    })
  }

  const toggleRls = async (table: TableInfo, enable: boolean) => {
    try {
      const sql = enable
        ? `ALTER TABLE "${table.schemaname}"."${table.tablename}" ENABLE ROW LEVEL SECURITY`
        : `ALTER TABLE "${table.schemaname}"."${table.tablename}" DISABLE ROW LEVEL SECURITY`
      const res = await fetch('/api/admin/policies/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql }),
      })
      if (!res.ok) throw new Error('Failed to toggle RLS')
      toaster.push(<Notification type="success" header="RLS Updated">Row Level Security {enable ? 'enabled' : 'disabled'}.</Notification>, { placement: 'topEnd' })
      fetchData()
    } catch (err) {
      toaster.push(<Notification type="error" header="Error">{err instanceof Error ? err.message : 'Failed to toggle RLS'}</Notification>, { placement: 'topEnd' })
    }
  }

  const executeCustomSql = async () => {
    if (!sqlInput.trim()) return
    setExecutingSql(true)
    try {
      const res = await fetch('/api/admin/policies/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: sqlInput }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'SQL execution failed')
      }
      toaster.push(<Notification type="success" header="SQL Executed">Statement executed successfully.</Notification>, { placement: 'topEnd' })
      setSqlModalOpen(false)
      setSqlInput('')
      fetchData()
    } catch (err) {
      toaster.push(<Notification type="error" header="SQL Error">{err instanceof Error ? err.message : 'Execution failed'}</Notification>, { placement: 'topEnd' })
    } finally {
      setExecutingSql(false)
    }
  }

  const cmdColor = (cmd: string) => {
    switch (cmd) {
      case 'SELECT': return 'blue'
      case 'INSERT': return 'green'
      case 'UPDATE': return 'orange'
      case 'DELETE': return 'red'
      default: return 'grey'
    }
  }

  if (loading) return <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>

  return (
    <div className="p-6">
      {error && (
        <Message type="error" closable onClose={() => setError(null)} className="mb-4">
          {error}
        </Message>
      )}

      <ConfirmationModal
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        config={confirmDelete}
      />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SelectPicker
            data={tables.map(t => ({ value: t.tablename, label: `${t.tablename} (${t.schemaname})` }))}
            value={selectedTable}
            onChange={(v: string | null) => setSelectedTable(v)}
            placeholder="All Tables"
            style={{ width: 250 }}
            cleanable
          />
          <span className="text-sm text-muted-foreground">
            {filteredPolicies.length} polic{filteredPolicies.length === 1 ? 'y' : 'ies'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setSqlModalOpen(true)}>
            <Play className="w-4 h-4 mr-1" /> SQL
          </Button>
          <Button size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4 mr-1" /> Refresh
          </Button>
          <Button appearance="primary" size="sm" onClick={() => openCreatePolicy(selectedTable || undefined)}>
            <Plus className="w-4 h-4 mr-1" /> New Policy
          </Button>
        </div>
      </div>

      <Table
        height={400}
        data={filteredPolicies}
        rowKey="oid"
        loading={loading}
      >
        <Column width={180}>
          <HeaderCell>Policy Name</HeaderCell>
          <Cell>{(rowData: RlsPolicy) => (
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-violet-500" />
              <span className="font-medium">{rowData.policyname}</span>
            </div>
          )}</Cell>
        </Column>
        <Column width={140}>
          <HeaderCell>Table</HeaderCell>
          <Cell>{(rowData: RlsPolicy) => (
            <Tag size="sm">{rowData.tablename}</Tag>
          )}</Cell>
        </Column>
        <Column width={80} align="center">
          <HeaderCell>Command</HeaderCell>
          <Cell>{(rowData: RlsPolicy) => (
            <Tag size="sm" color={cmdColor(rowData.cmd)}>{rowData.cmd}</Tag>
          )}</Cell>
        </Column>
        <Column width={120}>
          <HeaderCell>Roles</HeaderCell>
          <Cell>{(rowData: RlsPolicy) => (
            <span className="text-sm">{rowData.roles.join(', ') || 'public'}</span>
          )}</Cell>
        </Column>
        <Column width={200} flexGrow={1}>
          <HeaderCell>USING (qual)</HeaderCell>
          <Cell>{(rowData: RlsPolicy) => (
            <code className="text-xs bg-muted px-1 py-0.5 rounded truncate block max-w-full">
              {rowData.qual || '(none)'}
            </code>
          )}</Cell>
        </Column>
        <Column width={100} align="center">
          <HeaderCell>Actions</HeaderCell>
          <Cell>{(rowData: RlsPolicy) => (
            <div className="flex gap-1">
              <IconButton size="sm" appearance="subtle" icon={<Edit2 className="w-3.5 h-3.5" />}
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEditPolicy(rowData) }} />
              <IconButton size="sm" appearance="subtle" color="red" icon={<Trash2 className="w-3.5 h-3.5" />}
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); deletePolicy(rowData) }} />
            </div>
          )}</Cell>
        </Column>
      </Table>

      <div className="mt-6">
        <h4 className="text-sm font-semibold mb-3">Tables & RLS Status</h4>
        <Table height={200} data={tables} rowKey="tablename">
          <Column width={200}>
            <HeaderCell>Table</HeaderCell>
            <Cell>{(rowData: TableInfo) => (
              <span className="text-sm">{rowData.tablename}</span>
            )}</Cell>
          </Column>
          <Column width={100}>
            <HeaderCell>Schema</HeaderCell>
            <Cell>{(rowData: TableInfo) => (
              <span className="text-sm text-muted-foreground">{rowData.schemaname}</span>
            )}</Cell>
          </Column>
          <Column width={120}>
            <HeaderCell>RLS</HeaderCell>
            <Cell>{(rowData: TableInfo) => (
              <Tag size="sm" color={rowData.rls_enabled ? 'green' : 'red'}>
                {rowData.rls_enabled ? 'Enabled' : 'Disabled'}
              </Tag>
            )}</Cell>
          </Column>
          <Column width={160}>
            <HeaderCell>Actions</HeaderCell>
            <Cell>{(rowData: TableInfo) => (
              <Button size="sm" appearance="ghost"
                onClick={() => toggleRls(rowData, !rowData.rls_enabled)}>
                {rowData.rls_enabled ? 'Disable RLS' : 'Enable RLS'}
              </Button>
            )}</Cell>
          </Column>
          <Column width={120}>
            <HeaderCell>New Policy</HeaderCell>
            <Cell>{(rowData: TableInfo) => (
              <IconButton size="sm" appearance="subtle" icon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => openCreatePolicy(rowData.tablename)} />
            )}</Cell>
          </Column>
        </Table>
      </div>

      <Modal open={policyModalOpen} onClose={() => setPolicyModalOpen(false)} size="md" backdrop="static" draggable>
        <Modal.Header>
          <Modal.Title>{editingPolicy ? 'Edit Policy' : 'New Policy'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Table</label>
                <SelectPicker
                  data={tables.map(t => ({ value: t.tablename, label: t.tablename }))}
                  value={policyForm.tablename}
                  onChange={(v: string | null) => v && setPolicyForm(prev => ({ ...prev, tablename: v }))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Policy Name</label>
                <Input
                  value={policyForm.policyname}
                  onChange={(v: string) => setPolicyForm(prev => ({ ...prev, policyname: v }))}
                  placeholder="e.g. users_select_own"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Command</label>
                <SelectPicker
                  data={[
                    { value: 'SELECT', label: 'SELECT' },
                    { value: 'INSERT', label: 'INSERT' },
                    { value: 'UPDATE', label: 'UPDATE' },
                    { value: 'DELETE', label: 'DELETE' },
                    { value: 'ALL', label: 'ALL' },
                  ]}
                  value={policyForm.cmd}
                  onChange={(v: string | null) => v && setPolicyForm(prev => ({ ...prev, cmd: v }))}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Roles</label>
                <Input
                  value={policyForm.roles}
                  onChange={(v: string) => setPolicyForm(prev => ({ ...prev, roles: v }))}
                  placeholder="public, authenticated, custom_role"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">USING expression (qual)</label>
              <Input
                as="textarea"
                rows={3}
                value={policyForm.qual}
                onChange={(v: string) => setPolicyForm(prev => ({ ...prev, qual: v }))}
                placeholder="e.g. user_id = auth.uid()"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">WITH CHECK expression</label>
              <Input
                as="textarea"
                rows={3}
                value={policyForm.with_check}
                onChange={(v: string) => setPolicyForm(prev => ({ ...prev, with_check: v }))}
                placeholder="e.g. user_id = auth.uid()"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setPolicyModalOpen(false)} appearance="subtle">Cancel</Button>
          <Button onClick={savePolicy} appearance="primary" loading={executingSql}
            disabled={!policyForm.policyname.trim() || !policyForm.tablename.trim()}>
            {editingPolicy ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal open={sqlModalOpen} onClose={() => setSqlModalOpen(false)} size="lg" backdrop="static" draggable>
        <Modal.Header>
          <Modal.Title>Execute SQL</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label className="block text-sm font-medium mb-1">SQL Statement</label>
            <Input
              as="textarea"
              rows={8}
              value={sqlInput}
              onChange={(v: string) => setSqlInput(v)}
              placeholder="Enter SQL statement..."
              style={{ fontFamily: 'monospace', fontSize: 13 }}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setSqlModalOpen(false)} appearance="subtle">Cancel</Button>
          <Button onClick={executeCustomSql} appearance="primary" loading={executingSql}
            disabled={!sqlInput.trim()}>
            Execute
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default function AdminPolicyPage() {
  return (
    <ResourceView
      config={{
        type: 'custom',
        title: 'Policy Management',
        description: 'System-wide policies and Supabase Row-Level Security integration.',
        enableDefaultActions: false,
        customView: PolicyView,
      }}
    />
  )
}
