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
import type { Setting } from '@/lib/types'
// Using API routes instead of direct Drizzle imports

export default function AdminConfigurationsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const [draft, setDraft] = useState<Setting | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const response = await fetch('/api/configurations')
      const rows = await response.json()
      if (!mounted) return
      setSettings(rows)
      setLoading(false)
    })()
    return () => {
      mounted = false
    }
  }, [])

  const openCreate = () => {
    router.push('/admin/configurations/new')
  }

  const openEdit = (s: Setting) => {
    router.push(`/admin/configurations/${s.id}/edit`)
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

    const normalized: Setting = {
      ...draft,
      key: draft.key.trim(),
      value: draft.value.trim(),
      updatedAt: new Date().toISOString(),
    }

    setSettings((prev) => {
      const idx = prev.findIndex((x) => x.id === normalized.id)
      if (idx === -1) return [normalized, ...prev]
      const copy = [...prev]
      copy[idx] = normalized
      return copy
    })

    const response = await fetch('/api/configurations', {
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
    const ok = window.confirm('Delete this configuration?')
    if (!ok) return
    setSettings((prev) => prev.filter((s) => s.id !== id))
    const response = await fetch(`/api/configurations?id=${id}`, { method: 'DELETE' })
    const result = await response.json()
    const dbOk = result.success
    if (!dbOk) window.alert('Deleted locally (DB delete failed).')
  }

  const title = useMemo(() => (loading ? 'Configurations (loading...)' : 'Configurations'), [loading])

  return (
    <Card className="mx-auto max-w-7xl border-border/50">
      <div className="flex items-center justify-between gap-4 px-6 pt-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">Additional key/value configurations.</p>
        </div>
        <Button onClick={openCreate} size="sm">
          Add Configuration
        </Button>
      </div>

      <div className="p-6 pt-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-[180px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {settings.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="max-w-[140px] truncate">{s.id}</TableCell>
                <TableCell className="font-medium">{s.key}</TableCell>
                <TableCell className="max-w-[320px] truncate">{s.value}</TableCell>
                <TableCell className="max-w-[160px] truncate">
                  {new Date(s.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={() => openEdit(s)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => remove(s.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {settings.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground text-center py-10">
                  No configurations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === 'create' ? 'Add Configuration' : 'Edit Configuration'}</DialogTitle>
            <DialogDescription>Update key/value configuration.</DialogDescription>
          </DialogHeader>

          {draft && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">ID</label>
                <Input value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Key</label>
                <Input value={draft.key} onChange={(e) => setDraft({ ...draft, key: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Value</label>
                <Input
                  value={draft.value}
                  onChange={(e) => setDraft({ ...draft, value: e.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={close} disabled={saving}>
              Cancel
            </Button>
            <Button type="button" onClick={submit} disabled={saving || !draft?.key.trim()}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>

          {saveStatus && <p className="text-sm text-muted-foreground">{saveStatus}</p>}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

