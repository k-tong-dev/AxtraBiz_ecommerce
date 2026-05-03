import React from 'react'

// Widget Props Interface
export interface FieldWidgetProps {
  value: any
  onChange: (value: any) => void
  field: any
  data: any  // Full form data
  disabled?: boolean
  readonly?: boolean
}

// Widget Component Interface
export interface FieldWidgetComponent extends React.FC<FieldWidgetProps> {
  widgetName: string
}

// Registry for field widgets
export const fieldWidgets: Record<string, FieldWidgetComponent> = {}

// Register a widget
export function registerWidget(widget: FieldWidgetComponent) {
  fieldWidgets[widget.widgetName] = widget
}

// Get a widget by name
export function getWidget(name: string): FieldWidgetComponent | undefined {
  return fieldWidgets[name]
}

// Import and register widgets (lazy import to avoid circular dependency)
// import { Many2ManyListWidget } from './Many2ManyListWidget'
// registerWidget(Many2ManyListWidget as any)
