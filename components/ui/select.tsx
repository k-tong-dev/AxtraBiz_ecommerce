'use client'

import * as React from 'react'
import { SelectPicker } from 'rsuite'

import { cn } from '@/lib/utils'

type SelectOption = { label: string; value: string }
type SelectContextValue = {
  value?: string
  onValueChange?: (value: string) => void
  options: SelectOption[]
  registerOption: (option: SelectOption) => void
}
const SelectContext = React.createContext<SelectContextValue | null>(null)

function Select({
  value,
  onValueChange,
  children,
}: {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}) {
  const [options, setOptions] = React.useState<SelectOption[]>([])
  const registerOption = React.useCallback((option: SelectOption) => {
    setOptions((prev) => (prev.some((p) => p.value === option.value) ? prev : [...prev, option]))
  }, [])

  return (
    <SelectContext.Provider value={{ value, onValueChange, options, registerOption }}>
      {children}
    </SelectContext.Provider>
  )
}

function SelectTrigger({ className }: { className?: string }) {
  const context = React.useContext(SelectContext)
  if (!context) return null

  return (
    <SelectPicker
      data={context.options}
      value={context.value}
      onChange={(next) => context.onValueChange?.(String(next ?? ''))}
      cleanable={false}
      searchable={false}
      className={cn('w-full', className)}
    />
  )
}

function SelectItem({
  value,
  children,
}: {
  value: string
  children: React.ReactNode
}) {
  const context = React.useContext(SelectContext)
  React.useEffect(() => {
    context?.registerOption({ label: String(children), value })
  }, [children, context, value])
  return null
}

function SelectContent({ children }: { children: React.ReactNode }) { return <>{children}</> }
function SelectGroup({ children }: { children: React.ReactNode }) { return <>{children}</> }
function SelectValue() { return null }
function SelectLabel({ children }: { children: React.ReactNode }) { return <>{children}</> }
function SelectSeparator() { return null }
function SelectScrollUpButton() { return null }
function SelectScrollDownButton() { return null }

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
