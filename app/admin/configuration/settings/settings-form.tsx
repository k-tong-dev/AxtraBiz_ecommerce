'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input, Button, Loader, Message, toaster, Notification } from 'rsuite'
import { Save } from 'lucide-react'

interface Setting {
  id?: number
  key: string
  value: string
  category?: string
}

interface SettingsFormProps {
  settingKeys: string[]
  title: string
  description: string
}

export function SettingsForm({ settingKeys, title, description }: SettingsFormProps) {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings')
      if (!res.ok) throw new Error('Failed to fetch settings')
      const all: Setting[] = await res.json()
      const filtered = settingKeys.map(key => all.find(s => s.key === key) || { key, value: '' })
      setSettings(filtered)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [settingKeys])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const updateValue = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s))
  }

  const save = async () => {
    setSaving(true)
    try {
      const toSave = settings.filter(s => s.value)
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSave.map(s => ({
          ...(s.id ? { id: s.id } : {}),
          key: s.key,
          value: s.value,
        }))),
      })
      if (!res.ok) throw new Error('Failed to save settings')
      toaster.push(<Notification type="success" header="Saved">Settings updated successfully.</Notification>, { placement: 'topEnd' })
      fetchSettings()
    } catch (err) {
      toaster.push(<Notification type="error" header="Error">{err instanceof Error ? err.message : 'Failed to save'}</Notification>, { placement: 'topEnd' })
    } finally {
      setSaving(false)
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

      <div className="mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="space-y-4 max-w-xl">
        {settings.map(setting => (
          <div key={setting.key}>
            <label className="block text-sm font-medium mb-1 capitalize">
              {setting.key.replace(/_/g, ' ')}
            </label>
            <Input
              value={setting.value}
              onChange={(v: string) => updateValue(setting.key, v)}
              placeholder={`Enter ${setting.key.replace(/_/g, ' ')}`}
            />
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Button appearance="primary" onClick={save} loading={saving}>
          <Save className="w-4 h-4 mr-1" /> Save Changes
        </Button>
      </div>
    </div>
  )
}
