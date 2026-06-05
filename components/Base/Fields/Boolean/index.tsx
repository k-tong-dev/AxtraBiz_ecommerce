'use client'

import * as React from 'react'
import { Toggle } from 'rsuite'
import type { FieldProps } from '../types'

export function BooleanField({ config, value, onChange, error }: FieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-3">
        <Toggle
          className={config.className}
          size={config.size || 'sm'}
          checked={value || false}
          onChange={(checked) => onChange(checked)}
          disabled={config.readonly}
          checkedChildren="ON"
          unCheckedChildren="OFF"
          color={'violet'}
          draggable
        />
        {config.label && (
          <span className="text-sm text-foreground/70">{config.label}</span>
        )}
      </div>
      {(error || config.helper) && (
        <p className="text-xs text-muted-foreground">{error || config.helper}</p>
      )}
    </div>
  )
}
