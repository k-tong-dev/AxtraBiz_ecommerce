'use client'

import * as React from 'react'
import {
  SelectPicker,
  CheckPicker,
  TreePicker,
  CheckTreePicker,
  Avatar,
  Badge,
} from 'rsuite'
import type { SelectPickerProps, CheckPickerProps, TreePickerProps, CheckTreePickerProps } from 'rsuite'
import { cn } from '@/lib/utils'

type InputSize = 'sm' | 'md' | 'lg'

export interface SelectOption {
  id: string | number
  name: string
  avatar?: string
  group?: string
  children?: SelectOption[]
}

interface BaseSelectProps {
  options: SelectOption[]
  value?: string | string[] | null
  onChange?: (value: any) => void
  multiple?: boolean
  groupBy?: string
  tree?: boolean
  searchable?: boolean
  loading?: boolean
  placeholder?: string
  label?: string
  error?: boolean
  helperText?: string
  fullWidth?: boolean
  size?: InputSize
  disabled?: boolean
  className?: string
  onSearch?: (keyword: string) => void
  renderAvatar?: boolean
}

const sizeStyles: Record<InputSize, { picker: string; label: string }> = {
  sm: {
    picker: 'text-sm',
    label: 'top-3 text-xs peer-placeholder-shown:text-sm peer-focus:text-xs peer-focus:-translate-y-2.5 -translate-y-2.5 scale-75',
  },
  md: {
    picker: 'text-sm',
    label: 'top-4 text-sm peer-placeholder-shown:text-base peer-focus:text-sm',
  },
  lg: {
    picker: 'text-base',
    label: 'top-5 text-base peer-placeholder-shown:text-lg peer-focus:text-base',
  },
}

function toRsuiteData(options: SelectOption[], renderAvatar?: boolean): any[] {
  return options.map((opt) => {
    const label = renderAvatar && opt.avatar
      ? (
          <div className="flex items-center gap-2">
            <Avatar src={opt.avatar} size="xs" circle />
            <span>{opt.name}</span>
          </div>
        )
      : opt.name
    return {
      label,
      value: String(opt.id),
      role: opt.group,
      children: opt.children ? toRsuiteData(opt.children, renderAvatar) : undefined,
    }
  })
}

function getSelectedLabels(options: SelectOption[], value: string | string[] | null | undefined): string {
  if (!value) return ''
  const selected = Array.isArray(value) ? value : [value]
  const labels = selected.map((v) => {
    const found = findOption(options, v)
    return found?.name || v
  })
  return labels.join(', ')
}

function findOption(options: SelectOption[], value: string): SelectOption | undefined {
  for (const opt of options) {
    if (String(opt.id) === value) return opt
    if (opt.children) {
      const found = findOption(opt.children, value)
      if (found) return found
    }
  }
  return undefined
}

const PICKER_CLASSES =
  'peer w-full border-b-1 border-b-foreground bg-transparent text-foreground transition-colors duration-200 rounded-none disabled:cursor-not-allowed disabled:opacity-50'

const PICKER_BORDER = { borderTop: 0, borderRight: 0, borderLeft: 0, borderRadius: 0, outlineColor: 'transparent', boxShadow: 'none' }

function Select({
  options,
  value,
  onChange,
  multiple = false,
  groupBy,
  tree = false,
  searchable = true,
  loading = false,
  placeholder = 'Select...',
  label,
  error = false,
  helperText,
  fullWidth = false,
  size = 'md',
  disabled = false,
  className,
  onSearch,
  renderAvatar = false,
}: BaseSelectProps) {
  const inputId = React.useId()
  const data = React.useMemo(() => toRsuiteData(options, renderAvatar), [options, renderAvatar])
  const hasValue = value !== null && value !== undefined && value !== '' && !(Array.isArray(value) && value.length === 0)

  const sharedPickerProps = {
    data,
    searchable,
    loading,
    placeholder: placeholder || ' ',
    disabled,
    className: cn(PICKER_CLASSES, error ? 'border-destructive' : 'border-border', sizeStyles[size].picker),
    style: PICKER_BORDER,
    onSearch,
  }

  const renderBadge = (values: string | string[] | null | undefined) => {
    if (!values || (Array.isArray(values) && values.length === 0)) return null
    const vals = Array.isArray(values) ? values : [values]
    const selected = vals.map((v) => findOption(options, v)).filter(Boolean) as SelectOption[]
    if (selected.length === 0) return null
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {selected.map((opt) => (
          <Badge key={opt.id} className="!bg-primary/10 !text-primary !px-2 !py-0.5 !text-xs !font-medium !rounded-full">
            {renderAvatar && opt.avatar ? (
              <div className="flex items-center gap-1">
                <Avatar src={opt.avatar} size="xs" circle />
                <span>{opt.name}</span>
              </div>
            ) : (
              opt.name
            )}
          </Badge>
        ))}
      </div>
    )
  }

  const handleChange = (next: any) => {
    if (multiple && Array.isArray(next)) {
      onChange?.(next)
    } else {
      onChange?.(next ?? null)
    }
  }

  const renderPicker = () => {
    if (tree && multiple) {
      return (
        <CheckTreePicker
          {...(sharedPickerProps as any)}
          value={(value as string[]) || []}
          onChange={handleChange}
          cascade={false}
          cleanable={false}
          getChildren={undefined}
        />
      )
    }
    if (tree) {
      return (
        <TreePicker
          {...(sharedPickerProps as any)}
          value={(value as string) || null}
          onChange={handleChange}
          cleanable={false}
          getChildren={undefined}
        />
      )
    }
    if (multiple) {
      return (
        <CheckPicker
          {...(sharedPickerProps as CheckPickerProps<any>)}
          value={(value as string[]) || []}
          onChange={handleChange}
          cleanable={false}
          sticky
        />
      )
    }
    return (
      <SelectPicker
        {...(sharedPickerProps as SelectPickerProps<any>)}
        value={(value as string) || null}
        onChange={handleChange}
        groupBy={groupBy}
        cleanable={false}
      />
    )
  }

  return (
    <div className={cn(fullWidth ? 'w-full' : 'w-full max-w-sm', 'space-y-1', className)}>
      <div className="relative">
        <div className={cn(error ? 'text-destructive' : 'text-foreground')}>
          {renderPicker()}
        </div>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'absolute left-0 z-10 origin-[0] -translate-y-3 scale-75 text-muted-foreground duration-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-3 peer-focus:scale-75',
              hasValue && '-translate-y-3 scale-75',
              error
                ? 'text-destructive peer-focus:text-destructive'
                : 'peer-focus:text-primary',
              sizeStyles[size].label,
            )}
          >
            {label}
          </label>
        )}
        <div
          className={cn(
            'absolute bottom-0 left-1/2 h-px w-full -translate-x-1/2 scale-x-0 bg-foreground transition-transform duration-200 peer-focus:scale-x-100',
            error && 'bg-destructive',
          )}
        />
      </div>
      {multiple && value && Array.isArray(value) && renderBadge(value)}
      {helperText && (
        <p className={cn('text-xs transition-colors duration-200', error ? 'text-destructive' : 'text-muted-foreground')}>
          {helperText}
        </p>
      )}
    </div>
  )
}

export { Select }
