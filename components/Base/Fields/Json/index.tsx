'use client'

import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'
import type { FieldProps } from '../types'
import { cn } from '@/lib/utils'

export function JsonField({ config, value, onChange, error }: FieldProps) {
  const [text, setText] = React.useState(() =>
    value ? JSON.stringify(value, null, 2) : ''
  )
  const [parseError, setParseError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setText(value ? JSON.stringify(value, null, 2) : '')
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value
    setText(raw)
    if (!raw.trim()) {
      setParseError(null)
      onChange(null)
      return
    }
    try {
      const parsed = JSON.parse(raw)
      setParseError(null)
      onChange(parsed)
    } catch {
      setParseError('Invalid JSON')
    }
  }

  return (
    <div className="space-y-1">
      <Textarea
        value={text}
        onChange={handleChange}
        placeholder={config.placeholder || 'Enter JSON...'}
        label={config.label}
        error={!!error || !!parseError}
        helperText={parseError || error || config.helper}
        disabled={config.readonly}
        fullWidth
        inputSize={config.size}
        rows={8}
        autosize
        resize="vertical"
        className={cn(
          'font-mono text-sm',
          config.readonly && 'opacity-60 cursor-not-allowed',
        )}
      />
    </div>
  )
}
