'use client'

import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { FieldProps } from '../types'

export function HtmlField({ config, value, onChange, error }: FieldProps) {
  return (
    <div className="space-y-1">
      <Textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={config.placeholder || 'Enter HTML content...'}
        label={config.label}
        error={!!error}
        helperText={error || config.helper}
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
      {value && (
        <div className="border rounded p-3 bg-muted/30 text-xs text-muted-foreground">
          <details>
            <summary className="cursor-pointer font-medium mb-1">Preview</summary>
            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: value }} />
          </details>
        </div>
      )}
    </div>
  )
}
