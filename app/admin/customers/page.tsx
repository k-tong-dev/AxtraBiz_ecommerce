'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Search } from 'lucide-react'
import type { User } from '@/lib/types'
// Using API routes instead of direct Drizzle imports
import { StatusBadge } from '@/components/admin/status-badge'

export default function AdminCustomersPage() {
  const router = useRouter()
  const [customers, setCustomers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [draft, setDraft] = useState<User | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const response = await fetch('/api/users')
      const rows = await response.json()
      if (!mounted) return
      setCustomers(rows)
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [])

  const openCreate = () => {
    router.push('/admin/customers/new')
  }

  const openEdit = (u: User) => {
    router.push(`/admin/customers/${u.id}/edit`)
  }

  const close = () => {
    if (saving) return
    setOpen(false)
    setDraft(null)
    setSaveStatus(null)
  }

  const submit = async () => {
    if (!draft) return
    setSaving(true)
    setSaveStatus(null)

    const normalized: User = {
      ...draft,
      email: draft.email.trim(),
      name: draft.name.trim(),
    }

    setCustomers((prev) => {
      const idx = prev.findIndex((x) => x.id === normalized.id)
      if (idx === -1) return [normalized, ...prev]
      const copy = [...prev]
      copy[idx] = normalized
      return copy
    })

    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized)
    })
    const result = await response.json()
    const ok = result.success
    setSaveStatus(ok ? 'Saved to database.' : 'Saved locally (DB write failed).')
    setSaving(false)
    setTimeout(() => close(), 500)
  }

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this customer?')
    if (!ok) return
    setCustomers((prev) => prev.filter((c) => c.id !== id))
    const response = await fetch(`/api/users?id=${id}`, { method: 'DELETE' })
    const result = await response.json()
    const dbOk = result.success
    if (!dbOk) window.alert('Deleted locally (DB delete failed).')
  }

  const title = useMemo(() => (loading ? 'Customers (loading...)' : 'Customers'), [loading])
  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return customers
    return customers.filter((u) =>
      [u.id, u.name, u.email, u.role].some((value) => value.toLowerCase().includes(query)),
    )
  }, [customers, search])

  return (
    <Card className="mx-auto max-w-7xl border-border/50">
      <div className="flex items-center justify-between gap-4 px-6 pt-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage customer accounts and roles.</p>
        </div>
        <Button onClick={openCreate} size="sm">
          Add Customer
        </Button>
      </div>

      <div className="p-6 pt-0 space-y-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="pl-9"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="max-w-[160px] truncate">{u.id}</TableCell>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="max-w-[220px] truncate">{u.email}</TableCell>
                <TableCell>
                  <StatusBadge value={u.role} />
                </TableCell>
                <TableCell className="max-w-[140px] truncate">
                  {new Date(u.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => openEdit(u)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(u.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground text-center py-10">
                  No customers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Add Customer' : 'Edit Customer'}</DialogTitle>
            <DialogDescription>Update account info and role.</DialogDescription>
          </DialogHeader>

          {draft && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Name</label>
                  <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>
                <select
                  className="h-9 w-full rounded-md border border-border bg-background px-3"
                  value={draft.role}
                  onChange={(e) => setDraft({ ...draft, role: e.target.value as User['role'] })}
                >
                  <option value="customer">customer</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">ID</label>
                <Input value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} disabled={saving}>
              Cancel
            </Button>
            <Button type="button" onClick={submit} disabled={saving || !draft?.email.trim()}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>

          {saveStatus && <p className="text-sm text-muted-foreground">{saveStatus}</p>}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

