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

// Import and register widgets
import { One2ManyWidget } from './One2ManyWidget'
import { Many2ManyWidget } from './Many2ManyWidget'
import { Many2OneWidget } from './Many2OneWidget'
import { TagSelectWidget } from './TagSelectWidget'

registerWidget(One2ManyWidget as any)
registerWidget(Many2ManyWidget as any)
registerWidget(Many2OneWidget as any)
registerWidget(TagSelectWidget as any)

// Export config types for form configuration
export type { One2ManyWidgetConfig } from './One2ManyWidget'
export type { Many2ManyWidgetConfig } from './Many2ManyWidget'
export type { Many2OneWidgetConfig } from './Many2OneWidget'
