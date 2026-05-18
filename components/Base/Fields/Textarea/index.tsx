'use client'

import * as React from 'react'
import { Textarea } from '@/components/ui/textarea'
import type { FieldProps } from '../types'

export function TextareaField({ config, value, onChange, error }: FieldProps) {
  return (
    <Textarea
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={config.placeholder}
      label={config.label}
      error={!!error}
      helperText={error || config.helper}
      disabled={config.readonly}
      fullWidth
      inputSize={config.size}
      rows={4}
      autosize
      resize="horizontal"
      className={config.readonly ? 'opacity-60 cursor-not-allowed' : ''}
    />
  )
}
