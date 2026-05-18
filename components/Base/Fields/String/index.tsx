'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import type { FieldProps } from '../types'

export function StringField({ config, value, onChange, error }: FieldProps) {
  return (
    <Input
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={config.placeholder}
      label={config.label}
      error={!!error}
      helperText={error || config.helper}
      disabled={config.readonly}
      fullWidth
      inputSize={config.size}
      className={config.readonly ? 'opacity-60 cursor-not-allowed' : ''}
    />
  )
}
