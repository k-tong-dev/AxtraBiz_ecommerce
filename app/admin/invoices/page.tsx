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
import type { Invoice } from '@/lib/types'
// Using API routes instead of direct Drizzle imports
import { StatusBadge } from '@/components/admin/status-badge'

function stringToNumberOrZero(value: string) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

export default function AdminInvoicesPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [draft, setDraft] = useState<Invoice | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const response = await fetch('/api/invoices')
      const rows = await response.json()
      if (!mounted) return
      setInvoices(rows)
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [])

  const openCreate = () => {
    router.push('/admin/invoices/new')
  }

  const openEdit = (inv: Invoice) => {
    router.push(`/admin/invoices/${inv.id}/edit`)
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

    const normalized: Invoice = {
      ...draft,
      orderId: draft.orderId.trim(),
      customerId: draft.customerId.trim(),
      status: draft.status,
      total: Number(draft.total) || 0,
      dueDate: draft.dueDate?.trim() ? draft.dueDate.trim() : undefined,
    }

    setInvoices((prev) => {
      const idx = prev.findIndex((x) => x.id === normalized.id)
      if (idx === -1) return [normalized, ...prev]
      const copy = [...prev]
      copy[idx] = normalized
      return copy
    })

    const response = await fetch('/api/invoices', {
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
    const ok = window.confirm('Delete this invoice?')
    if (!ok) return
    setInvoices((prev) => prev.filter((i) => i.id !== id))
    const response = await fetch(`/api/invoices?id=${id}`, { method: 'DELETE' })
    const result = await response.json()
    const dbOk = result.success
    if (!dbOk) window.alert('Deleted locally (DB delete failed).')
  }

  const title = useMemo(() => (loading ? 'Invoices (loading...)' : 'Invoices'), [loading])
  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return invoices
    return invoices.filter((inv) =>
      [inv.id, inv.orderId, inv.customerId, inv.status].some((value) =>
        value.toLowerCase().includes(query),
      ),
    )
  }, [invoices, search])

  return (
    <Card className="mx-auto max-w-7xl border-border/50">
      <div className="flex items-center justify-between gap-4 px-6 pt-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage invoices and payment status.</p>
        </div>
        <Button onClick={openCreate} size="sm">
          Add Invoice
        </Button>
      </div>

      <div className="p-6 pt-0 space-y-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoices..."
            className="pl-9"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="max-w-[140px] truncate">{inv.id}</TableCell>
                <TableCell className="max-w-[140px] truncate">{inv.orderId}</TableCell>
                <TableCell className="max-w-[180px] truncate">{inv.customerId}</TableCell>
                <TableCell className="text-right">${inv.total.toFixed(2)}</TableCell>
                <TableCell>
                  <StatusBadge value={inv.status} />
                </TableCell>
                <TableCell className="max-w-[140px] truncate">
                  {new Date(inv.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => openEdit(inv)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(inv.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredInvoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-muted-foreground text-center py-10">
                  No invoices found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Add Invoice' : 'Edit Invoice'}</DialogTitle>
            <DialogDescription>Update invoice fields. Syncs to Supabase when possible.</DialogDescription>
          </DialogHeader>

          {draft && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Invoice ID</label>
                  <Input value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order ID</label>
                  <Input value={draft.orderId} onChange={(e) => setDraft({ ...draft, orderId: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer ID</label>
                  <Input value={draft.customerId} onChange={(e) => setDraft({ ...draft, customerId: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total</label>
                  <Input
                    type="number"
                    value={draft.total}
                    onChange={(e) => setDraft({ ...draft, total: stringToNumberOrZero(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    className="h-9 w-full rounded-md border border-border bg-background px-3"
                    value={draft.status}
                    onChange={(e) => setDraft({ ...draft, status: e.target.value as Invoice['status'] })}
                  >
                    <option value="draft">draft</option>
                    <option value="issued">issued</option>
                    <option value="paid">paid</option>
                    <option value="void">void</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Created At</label>
                  <Input
                    value={draft.createdAt}
                    onChange={(e) => setDraft({ ...draft, createdAt: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date (optional)</label>
                <Input
                  value={draft.dueDate ?? ''}
                  placeholder="YYYY-MM-DD"
                  onChange={(e) => setDraft({ ...draft, dueDate: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} disabled={saving}>
              Cancel
            </Button>
            <Button type="button" onClick={submit} disabled={saving || !draft?.id}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>

          {saveStatus && <p className="text-sm text-muted-foreground">{saveStatus}</p>}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

