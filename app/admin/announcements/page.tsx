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
import { Search } from 'lucide-react'
import type { Announcement } from '@/lib/types'
// Using API routes instead of direct Drizzle imports
import { StatusBadge } from '@/components/admin/status-badge'

export default function AdminAnnouncementsPage() {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [draft, setDraft] = useState<Announcement | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const response = await fetch('/api/announcements')
      const rows = await response.json()
      if (!mounted) return
      setAnnouncements(rows)
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [])

  const openCreate = () => {
    router.push('/admin/announcements/new')
  }

  const openEdit = (a: Announcement) => {
    router.push(`/admin/announcements/${a.id}/edit`)
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

    const normalized: Announcement = {
      ...draft,
      title: draft.title.trim(),
      message: draft.message.trim(),
      expiresAt: draft.expiresAt?.trim() ? draft.expiresAt.trim() : undefined,
      publishedAt: draft.publishedAt.trim(),
    }

    setAnnouncements((prev) => {
      const idx = prev.findIndex((x) => x.id === normalized.id)
      if (idx === -1) return [normalized, ...prev]
      const copy = [...prev]
      copy[idx] = normalized
      return copy
    })

    const response = await fetch('/api/announcements', {
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
    const ok = window.confirm('Delete this announcement?')
    if (!ok) return
    setAnnouncements((prev) => prev.filter((a) => a.id !== id))
    const response = await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' })
    const result = await response.json()
    const dbOk = result.success
    if (!dbOk) window.alert('Deleted locally (DB delete failed).')
  }

  const title = useMemo(
    () => (loading ? 'Announcements (loading...)' : 'Announcements'),
    [loading],
  )
  const filteredAnnouncements = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return announcements
    return announcements.filter((a) =>
      [a.id, a.title, a.type, a.message].some((value) =>
        value.toLowerCase().includes(query),
      ),
    )
  }, [announcements, search])

  return (
    <Card className="mx-auto max-w-7xl border-border/50">
      <div className="flex items-center justify-between gap-4 px-6 pt-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage site announcements and campaigns.</p>
        </div>
        <Button onClick={openCreate} size="sm">
          Add Announcement
        </Button>
      </div>

      <div className="p-6 pt-0 space-y-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search announcements..."
            className="pl-9"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnnouncements.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="max-w-[140px] truncate">{a.id}</TableCell>
                <TableCell className="font-medium">{a.title}</TableCell>
                <TableCell>
                  <StatusBadge value={a.type} />
                </TableCell>
                <TableCell>
                  <StatusBadge value={a.active ? 'active' : 'inactive'} />
                </TableCell>
                <TableCell className="max-w-[160px] truncate">
                  {new Date(a.publishedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => openEdit(a)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(a.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {filteredAnnouncements.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground text-center py-10">
                  No announcements found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Add Announcement' : 'Edit Announcement'}</DialogTitle>
            <DialogDescription>Update announcement fields. Syncs to Supabase when possible.</DialogDescription>
          </DialogHeader>

          {draft && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">ID</label>
                  <Input value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <select
                    className="h-9 w-full rounded-md border border-border bg-background px-3"
                    value={draft.type}
                    onChange={(e) => setDraft({ ...draft, type: e.target.value as Announcement['type'] })}
                  >
                    <option value="info">info</option>
                    <option value="success">success</option>
                    <option value="warning">warning</option>
                    <option value="error">error</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  value={draft.message}
                  onChange={(e) => setDraft({ ...draft, message: e.target.value })}
                  rows={5}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Active</label>
                  <select
                    className="h-9 w-full rounded-md border border-border bg-background px-3"
                    value={draft.active ? 'true' : 'false'}
                    onChange={(e) => setDraft({ ...draft, active: e.target.value === 'true' })}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Published At</label>
                  <Input
                    value={draft.publishedAt}
                    onChange={(e) => setDraft({ ...draft, publishedAt: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Expires At (optional)</label>
                <Input
                  value={draft.expiresAt ?? ''}
                  onChange={(e) => setDraft({ ...draft, expiresAt: e.target.value })}
                  placeholder="ISO string"
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

