'use client'

import { Trash2, Printer, Play, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AdminFormActionBar({
  state,
  onSave,
  onDelete,
  onPrint,
  onCustomAction,
  customActionLabel = 'Custom Action',
  saveDisabled,
  deleteDisabled,
}: {
  state?: string
  onSave: () => void
  onDelete?: () => void
  onPrint?: () => void
  onCustomAction?: () => void
  customActionLabel?: string
  saveDisabled?: boolean
  deleteDisabled?: boolean
}) {
  return (
    <div className="sticky top-[72px] z-30 rounded-2xl border border-border/60 bg-background/90 p-3 backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-2">
        {state && (
          <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            State: {state}
          </span>
        )}

        <Button size="sm" onClick={onSave} disabled={saveDisabled} className="gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>

        {onCustomAction && (
          <Button size="sm" variant="outline" onClick={onCustomAction} className="gap-2">
            <Play className="h-4 w-4" />
            {customActionLabel}
          </Button>
        )}

        {onPrint && (
          <Button size="sm" variant="outline" onClick={onPrint} className="gap-2">
            <Printer className="h-4 w-4" />
            Print
          </Button>
        )}

        {onDelete && (
          <Button
            size="sm"
            variant="destructive"
            onClick={onDelete}
            disabled={deleteDisabled}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
    </div>
  )
}

