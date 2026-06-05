'use client'

import * as React from 'react'
import { Checkbox } from 'rsuite'
import type { FieldProps } from '../types'

export function CheckboxField({ config, value, onChange, error }: FieldProps) {
  return (
    <div className="space-y-1">
      <Checkbox
        checked={value || false}
        onChange={(_val, checked) => onChange(checked)}
        disabled={config.readonly}
      >
        {config.label}
      </Checkbox>
      {(error || config.helper) && (
        <p className="text-xs text-muted-foreground">{error || config.helper}</p>
      )}
    </div>
  )
}
