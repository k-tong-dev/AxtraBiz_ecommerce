'use client'

import * as React from 'react'
import { NumberInput } from '@/components/ui/input'
import type { FieldProps } from '../types'

export function NumberField({ config, value, onChange, error }: FieldProps) {
  return (
    <NumberInput
      value={value ?? null}
      onChange={(val) => onChange(val ?? 0)}
      placeholder={config.placeholder}
      label={config.label}
      error={!!error}
      helperText={error || config.helper}
      disabled={config.readonly}
      fullWidth
      inputSize={config.size}
      min={0}
      controls={false}
      className={config.readonly ? 'opacity-60 cursor-not-allowed' : ''}
    />
  )
}
