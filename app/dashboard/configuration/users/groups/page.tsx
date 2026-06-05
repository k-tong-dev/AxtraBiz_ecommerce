'use client'

import { useState, useEffect, useCallback } from 'react'
import { ResourceView } from '@/components/Base/Views'
import type { CustomViewProps } from '@/components/Base/Views/types'
import { Table, Button, Modal, Input, Tag, Loader, Message, Checkbox, IconButton, Whisper, Popover } from 'rsuite'
import { Plus, Edit2, Trash2, Shield } from 'lucide-react'
import { ConfirmationModal } from '@/components/Base/Actions'

const { Column, HeaderCell, Cell } = Table

interface Role {
  id: number
  name: string
  role_type: 'predefined' | 'custom'
  description?: string
  shop_id?: number | null
  created_at?: string
  updated_at?: string
}

interface Permission {
  id: number
  resource: string
  action: 'read' | 'write' | 'delete'
  scope: string
}

interface RolePermission {
  id: number
  role_id: number
  permission_id: number
}

function GroupsView({ loading: _loading, onRefresh }: CustomViewProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [roleForm, setRoleForm] = useState({ name: '', description: '' })

  const [confirmDelete, setConfirmDelete] = useState<{ message: string; onConfirm: () => void } | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [rolesRes, permsRes, rpRes] = await Promise.all([
        fetch('/api/dashboard/roles'),
        fetch('/api/dashboard/permissions'),
        fetch('/api/dashboard/role-permissions'),
      ])
      if (!rolesRes.ok || !permsRes.ok || !rpRes.ok) throw new Error('Failed to fetch data')
      setRoles(await rolesRes.json())
      setPermissions(await permsRes.json())
      setRolePermissions(await rpRes.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const openCreateRole = () => {
    setEditingRole(null)
    setRoleForm({ name: '', description: '' })
    setRoleModalOpen(true)
  }

  const openEditRole = (role: Role) => {
    setEditingRole(role)
    setRoleForm({ name: role.name, description: role.description || '' })
    setRoleModalOpen(true)
  }

  const saveRole = async () => {
    if (!roleForm.name.trim()) return
    try {
      const body = editingRole
        ? { id: editingRole.id, name: roleForm.name, description: roleForm.description }
        : { name: roleForm.name, description: roleForm.description, role_type: 'custom' }

      const res = await fetch('/api/dashboard/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to save role')
      setRoleModalOpen(false)
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save role')
    }
  }

  const deleteRole = (role: Role) => {
    setConfirmDelete({
      message: `Are you sure you want to delete the role "${role.name}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/dashboard/roles?id=${role.id}`, { method: 'DELETE' })
          if (!res.ok) throw new Error('Failed to delete role')
          if (selectedRole?.id === role.id) setSelectedRole(null)
          fetchData()
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to delete role')
        }
      },
    })
  }

  const rolePermIds = rolePermissions
    .filter(rp => rp.role_id === selectedRole?.id)
    .map(rp => rp.permission_id)

  const togglePermission = async (perm: Permission) => {
    if (!selectedRole) return
    const existing = rolePermissions.find(rp => rp.role_id === selectedRole.id && rp.permission_id === perm.id)
    try {
      if (existing) {
        const res = await fetch(`/api/dashboard/role-permissions?id=${existing.id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error('Failed to remove permission')
      } else {
        const res = await fetch('/api/dashboard/role-permissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role_id: selectedRole.id, permission_id: perm.id }),
        })
        if (!res.ok) throw new Error('Failed to add permission')
      }
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update permission')
    }
  }

  const groupedPermissions = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    if (!acc[p.resource]) acc[p.resource] = []
    acc[p.resource].push(p)
    return acc
  }, {})

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

      <div className="flex gap-6">
        <div className="w-1/2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Roles</h3>
            <Button appearance="primary" size="sm" onClick={openCreateRole}>
              <Plus className="w-4 h-4 mr-1" /> New Role
            </Button>
          </div>
          <Table
            height={400}
            data={roles}
            rowKey="id"
            onRowClick={(rowData: Role) => setSelectedRole(rowData)}
            rowClassName={(rowData: Role | undefined) =>
              rowData && selectedRole?.id === rowData.id ? 'rs-table-row-selected' : ''
            }
            loading={loading}
          >
            <Column width={200}>
              <HeaderCell>Name</HeaderCell>
              <Cell>{(rowData: Role) => (
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-violet-500" />
                  <span>{rowData.name}</span>
                  {rowData.role_type === 'predefined' && (
                    <Tag size="sm" color="blue">System</Tag>
                  )}
                </div>
              )}</Cell>
            </Column>
            <Column width={100}>
              <HeaderCell>Type</HeaderCell>
              <Cell>{(rowData: Role) => (
                <span className="capitalize text-sm text-muted-foreground">{rowData.role_type}</span>
              )}</Cell>
            </Column>
            <Column width={100} align="center">
              <HeaderCell>Actions</HeaderCell>
              <Cell>{(rowData: Role) => (
                <div className="flex gap-1">
                  <IconButton
                    size="sm"
                    appearance="subtle"
                    icon={<Edit2 className="w-3.5 h-3.5" />}
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEditRole(rowData) }}
                  />
                  {rowData.role_type !== 'predefined' && (
                    <IconButton
                      size="sm"
                      appearance="subtle"
                      color="red"
                      icon={<Trash2 className="w-3.5 h-3.5" />}
                      onClick={(e: React.MouseEvent) => { e.stopPropagation(); deleteRole(rowData) }}
                    />
                  )}
                </div>
              )}</Cell>
            </Column>
          </Table>
        </div>

        <div className="w-1/2">
          <h3 className="text-lg font-semibold mb-4">
            Permissions
            {selectedRole && <span className="text-muted-foreground font-normal ml-2">— {selectedRole.name}</span>}
          </h3>
          {!selectedRole ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground border rounded-lg">
              Select a role to manage its permissions
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              {Object.entries(groupedPermissions).map(([resource, perms]) => (
                <div key={resource} className="border-b last:border-b-0">
                  <div className="px-4 py-2 bg-muted/30 font-medium capitalize text-sm">{resource}</div>
                  <div className="px-4 py-2 flex gap-4">
                    {perms.map(perm => (
                      <label key={perm.id} className="flex items-center gap-2 cursor-pointer text-sm">
                        <Checkbox
                          checked={rolePermIds.includes(perm.id)}
                          onChange={() => togglePermission(perm)}
                        />
                        <span className="capitalize">{perm.action}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={roleModalOpen} onClose={() => setRoleModalOpen(false)} size="sm" backdrop="static" draggable>
        <Modal.Header>
          <Modal.Title>{editingRole ? 'Edit Role' : 'New Role'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                placeholder="e.g. Editor, Support Agent"
                value={roleForm.name}
                onChange={(v: string) => setRoleForm(prev => ({ ...prev, name: v }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Input
                as="textarea"
                rows={3}
                placeholder="Describe the role's purpose and permissions..."
                value={roleForm.description}
                onChange={(v: string) => setRoleForm(prev => ({ ...prev, description: v }))}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setRoleModalOpen(false)} appearance="subtle">Cancel</Button>
          <Button onClick={saveRole} appearance="primary" disabled={!roleForm.name.trim()}>
            {editingRole ? 'Update' : 'Create'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default function AdminGroupsPage() {
  return (
    <ResourceView
      config={{
        type: 'custom',
        title: 'Groups & Permissions',
        description: 'Manage roles, groups, and permission scopes.',
        enableDefaultActions: false,
        customView: GroupsView,
      }}
    />
  )
}
