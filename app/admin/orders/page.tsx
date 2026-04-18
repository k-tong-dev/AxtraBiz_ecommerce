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
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import type { Order, ShippingAddress } from '@/lib/types'
// Using API routes instead of direct Drizzle imports
import type { OrderItem } from '@/lib/types'
import { StatusBadge } from '@/components/admin/status-badge'
import { Kanban, KanbanBoard, KanbanColumn, KanbanItem } from '@/components/ui/kanban'

function stringToNumberOrZero(value: string) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function safeParseJson<T>(raw: string): { ok: true; value: T } | { ok: false; error: string } {
  try {
    const v = JSON.parse(raw)
    return { ok: true, value: v as T }
  } catch {
    return { ok: false, error: 'Invalid JSON' }
  }
}

const defaultShipping: ShippingAddress = {
  name: 'Customer',
  email: 'customer@example.com',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'USA',
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<'createdAt' | 'totalPrice' | 'status'>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [draft, setDraft] = useState<Order | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)
  const [itemsJson, setItemsJson] = useState('[]')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const response = await fetch('/api/orders')
      const rows = await response.json()
      if (!mounted) return
      setOrders(rows)
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [])

  const openCreate = () => {
    router.push('/admin/orders/new')
  }

  const openEdit = (o: Order) => {
    router.push(`/admin/orders/${o.id}/edit`)
  }

  const close = () => {
    if (saving) return
    setOpen(false)
    setDraft(null)
    setItemsJson('[]')
    setSaveStatus(null)
  }

  const submit = async () => {
    if (!draft) return

    // Parse items JSON (best-effort; falls back to draft.items on parse error)
    const parsed = safeParseJson<OrderItem[]>(itemsJson)
    const normalized: Order = {
      ...draft,
      userId: draft.userId.trim(),
      status: draft.status,
      trackingNumber: draft.trackingNumber?.trim() ?? undefined,
      totalPrice: Number(draft.totalPrice) || 0,
      items: parsed.ok ? parsed.value : draft.items,
      shippingAddress: {
        ...draft.shippingAddress,
        address: draft.shippingAddress.address.trim(),
        city: draft.shippingAddress.city.trim(),
        state: draft.shippingAddress.state.trim(),
        zipCode: draft.shippingAddress.zipCode.trim(),
      },
    }

    setSaving(true)
    setSaveStatus(null)

    // Optimistic local update
    setOrders((prev) => {
      const idx = prev.findIndex((x) => x.id === normalized.id)
      if (idx === -1) return [normalized, ...prev]
      const copy = [...prev]
      copy[idx] = normalized
      return copy
    })

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...normalized, items: normalized.items } as any)
    })
    const result = await response.json()
    const ok = result.success
    setSaveStatus(ok ? 'Saved to database.' : 'Saved locally (DB write failed).')
    setSaving(false)
    setTimeout(() => close(), 500)
  }

  const remove = async (id: string) => {
    const ok = window.confirm('Delete this order?')
    if (!ok) return
    setOrders((prev) => prev.filter((o) => o.id !== id))
    const response = await fetch(`/api/orders?id=${id}`, { method: 'DELETE' })
    const result = await response.json()
    const dbOk = result.success
    if (!dbOk) window.alert('Deleted locally (DB delete failed).')
  }

  const removeSelected = async () => {
    if (!selectedIds.length) return
    const ok = window.confirm(`Delete ${selectedIds.length} selected orders?`)
    if (!ok) return
    setOrders((prev) => prev.filter((o) => !selectedIds.includes(o.id)))
    const ids = [...selectedIds]
    setSelectedIds([])
    await Promise.all(ids.map(async (id) => {
      const response = await fetch(`/api/orders?id=${id}`, { method: 'DELETE' })
      return response.json()
    }))
  }

  const title = useMemo(() => (loading ? 'Orders (loading...)' : 'Orders'), [loading])
  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return orders
    return orders.filter((o) =>
      [o.id, o.userId, o.status, o.trackingNumber ?? '', o.shippingAddress.city].some((value) =>
        value.toLowerCase().includes(query),
      ),
    )
  }, [orders, search])

  const sortedOrders = useMemo(() => {
    const copy = [...filteredOrders]
    copy.sort((a, b) => {
      const direction = sortDir === 'asc' ? 1 : -1
      switch (sortBy) {
        case 'totalPrice':
          return (a.totalPrice - b.totalPrice) * direction
        case 'status':
          return a.status.localeCompare(b.status) * direction
        default:
          return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * direction
      }
    })
    return copy
  }, [filteredOrders, sortBy, sortDir])

  const pageSize = 8
  const totalPages = Math.max(1, Math.ceil(sortedOrders.length / pageSize))
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedOrders.slice(start, start + pageSize)
  }, [page, sortedOrders])

  const allPageSelected =
    paginatedOrders.length > 0 &&
    paginatedOrders.every((order) => selectedIds.includes(order.id))

  const toggleSort = (key: typeof sortBy) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortDir('asc')
    }
  }

  const renderSortIcon = (key: typeof sortBy) => {
    if (sortBy !== key) return null
    return sortDir === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  const kanbanValue = useMemo(() => {
    const grouped: Record<string, Order[]> = {
      pending: [],
      confirmed: [],
      shipped: [],
      delivered: [],
      cancelled: [],
    }
    for (const order of filteredOrders) {
      const key = grouped[order.status] ? order.status : 'pending'
      grouped[key].push(order)
    }
    return grouped
  }, [filteredOrders])

  const onKanbanValueChange = (next: Record<string, Order[]>) => {
    const merged: Order[] = []
    Object.entries(next).forEach(([status, list]) => {
      list.forEach((order) => {
        merged.push({ ...order, status: status as Order['status'] })
      })
    })
    setOrders((prev) => {
      const prevMap = new Map(prev.map((o) => [o.id, o]))
      const updated = merged.map((o) => ({ ...(prevMap.get(o.id) ?? o), ...o }))
      return updated
    })
  }

  return (
    <Card className="mx-auto max-w-7xl border-border/50">
      <div className="flex items-center justify-between gap-4 px-6 pt-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage orders and fulfillment status.</p>
        </div>
        <Button onClick={openCreate} size="sm">
          Add Order
        </Button>
      </div>

      <div className="p-6 pt-0 space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(1)
              }}
              placeholder="Search orders..."
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => toggleSort('createdAt')} className="gap-1">
              Date {renderSortIcon('createdAt')}
            </Button>
            <Button size="sm" variant="outline" onClick={() => toggleSort('totalPrice')} className="gap-1">
              Total {renderSortIcon('totalPrice')}
            </Button>
            <select
              className="h-9 rounded-md border border-border bg-background px-2 text-sm"
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as 'list' | 'kanban')}
            >
              <option value="list">List View</option>
              <option value="kanban">Kanban View</option>
            </select>
            <Button size="sm" variant="outline" onClick={removeSelected} disabled={!selectedIds.length}>
              Delete Selected
            </Button>
          </div>
        </div>
        {viewMode === 'list' ? (
          <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds((prev) => Array.from(new Set([...prev, ...paginatedOrders.map((o) => o.id)])))
                    } else {
                      setSelectedIds((prev) => prev.filter((id) => !paginatedOrders.some((o) => o.id === id)))
                    }
                  }}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>
                <button type="button" onClick={() => toggleSort('status')} className="inline-flex items-center gap-1">
                  Status {renderSortIcon('status')}
                </button>
              </TableHead>
              <TableHead className="text-right">
                <button type="button" onClick={() => toggleSort('totalPrice')} className="inline-flex items-center gap-1">
                  Total {renderSortIcon('totalPrice')}
                </button>
              </TableHead>
              <TableHead>
                <button type="button" onClick={() => toggleSort('createdAt')} className="inline-flex items-center gap-1">
                  Created {renderSortIcon('createdAt')}
                </button>
              </TableHead>
              <TableHead>Tracking</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((o) => (
              <TableRow key={o.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(o.id)}
                    onChange={(e) => {
                      setSelectedIds((prev) =>
                        e.target.checked ? [...prev, o.id] : prev.filter((id) => id !== o.id),
                      )
                    }}
                  />
                </TableCell>
                <TableCell className="max-w-[160px] truncate">{o.id}</TableCell>
                <TableCell className="max-w-[180px] truncate">{o.userId}</TableCell>
                <TableCell>
                  <StatusBadge value={o.status} />
                </TableCell>
                <TableCell className="text-right">${o.totalPrice.toFixed(2)}</TableCell>
                <TableCell className="max-w-[140px] truncate">{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                <TableCell className="max-w-[160px] truncate">{o.trackingNumber || '—'}</TableCell>
                <TableCell>{o.shippingAddress.city || '—'}</TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => openEdit(o)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(o.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {paginatedOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-muted-foreground text-center py-10">
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          </Table>
        ) : (
          <div className="h-[620px] rounded-xl border border-border/60 bg-muted/20 p-3">
            <Kanban
              value={kanbanValue}
              getItemValue={(item) => item.id}
              onValueChange={onKanbanValueChange}
            >
              <KanbanBoard className="overflow-x-auto pb-2">
                {Object.entries(kanbanValue).map(([status, items]) => (
                  <KanbanColumn
                    key={status}
                    value={status}
                    className="min-w-[280px] max-w-[320px]"
                  >
                    <div className="flex items-center justify-between px-1 py-1">
                      <StatusBadge value={status} />
                      <span className="text-xs text-muted-foreground">{items.length}</span>
                    </div>
                    {items.map((order) => (
                      <KanbanItem key={order.id} value={order.id}>
                        <div className="rounded-lg border border-border/60 bg-background p-3">
                          <p className="font-medium text-sm">{order.id}</p>
                          <p className="text-xs text-muted-foreground mt-1">{order.userId}</p>
                          <p className="text-sm mt-2">${order.totalPrice.toFixed(2)}</p>
                          <div className="mt-3 flex justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEdit(order)}
                            >
                              Open
                            </Button>
                          </div>
                        </div>
                      </KanbanItem>
                    ))}
                  </KanbanColumn>
                ))}
              </KanbanBoard>
            </Kanban>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {paginatedOrders.length} of {sortedOrders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Previous
            </Button>
            <span>
              Page {page} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Add Order' : 'Edit Order'}</DialogTitle>
            <DialogDescription>Update order information. Items are edited as JSON.</DialogDescription>
          </DialogHeader>

          {draft && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Order ID</label>
                  <Input value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">User ID</label>
                  <Input value={draft.userId} onChange={(e) => setDraft({ ...draft, userId: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Input value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as any })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Total Price</label>
                  <Input
                    type="number"
                    value={draft.totalPrice}
                    onChange={(e) => setDraft({ ...draft, totalPrice: stringToNumberOrZero(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Created At</label>
                  <Input
                    value={draft.createdAt}
                    onChange={(e) => setDraft({ ...draft, createdAt: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tracking Number</label>
                  <Input
                    value={draft.trackingNumber ?? ''}
                    onChange={(e) => setDraft({ ...draft, trackingNumber: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Shipping Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    placeholder="Address"
                    value={draft.shippingAddress.address}
                    onChange={(e) => setDraft({ ...draft, shippingAddress: { ...draft.shippingAddress, address: e.target.value } })}
                  />
                  <Input
                    placeholder="City"
                    value={draft.shippingAddress.city}
                    onChange={(e) => setDraft({ ...draft, shippingAddress: { ...draft.shippingAddress, city: e.target.value } })}
                  />
                  <Input
                    placeholder="State"
                    value={draft.shippingAddress.state}
                    onChange={(e) => setDraft({ ...draft, shippingAddress: { ...draft.shippingAddress, state: e.target.value } })}
                  />
                  <Input
                    placeholder="ZIP Code"
                    value={draft.shippingAddress.zipCode}
                    onChange={(e) => setDraft({ ...draft, shippingAddress: { ...draft.shippingAddress, zipCode: e.target.value } })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Items (OrderItem JSON)</label>
                <Textarea value={itemsJson} onChange={(e) => setItemsJson(e.target.value)} rows={6} />
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

