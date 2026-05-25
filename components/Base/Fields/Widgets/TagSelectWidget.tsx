'use client'

import React, { useState, useEffect } from 'react'
import { TagPicker } from 'rsuite'
import { FieldWidgetProps, FieldWidgetComponent } from './index'

interface TagSelectWidgetConfig {
  relation: string
  displayField: string
  valueField?: string
}

export const TagSelectWidget: React.FC<FieldWidgetProps> = ({
  value,
  onChange,
  field,
  data,
  disabled,
  readonly
}) => {
  const widgetConfig = field.widgetConfig as TagSelectWidgetConfig

  // Developer validation
  if (typeof window !== 'undefined') {
    if (!widgetConfig) {
      console.error(
        '[TagSelectWidget] Missing widgetConfig. ' +
        'You must provide a widgetConfig with at least "relation" and "displayField". ' +
        'Example: widgetConfig: { relation: "/api/admin/related-records", displayField: "name" }'
      )
    } else if (!widgetConfig.relation || !widgetConfig.displayField) {
      console.error(
        `[TagSelectWidget] Missing required config: ${!widgetConfig.relation ? 'relation ' : ''}${!widgetConfig.displayField ? 'displayField' : ''}. ` +
        'Example: widgetConfig: { relation: "/api/admin/related-records", displayField: "name" }'
      )
    }
  }

  // Guard: show fallback UI instead of crashing when config is missing
  if (!widgetConfig || !widgetConfig.relation || !widgetConfig.displayField) {
    return (
      <div className="border border-destructive/30 rounded-md p-4 bg-destructive/5">
        <p className="text-sm text-destructive font-medium">TagSelectWidget configuration error</p>
        <p className="text-xs text-muted-foreground mt-1">
          Missing required widgetConfig properties (<code>relation</code>, <code>displayField</code>). Check the browser console for details.
        </p>
      </div>
    )
  }

  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const valueField = widgetConfig.valueField || 'id'
  const displayField = widgetConfig.displayField

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true)
        const response = await fetch(widgetConfig.relation)
        const data = await response.json()
        setOptions(data.map((item: any) => ({
          label: item[displayField],
          value: item[valueField]
        })))
      } catch (error) {
        console.error('Error fetching options:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOptions()
  }, [widgetConfig.relation, displayField, valueField])

  const selectedValues = Array.isArray(value) ? value : (value ? [value] : [])

  return (
    <TagPicker
      data={options}
      value={selectedValues}
      onChange={(newValue: any) => {
        onChange(newValue)
      }}
      disabled={disabled || readonly}
      loading={loading}
      block
      placeholder={`Select ${field.label.toLowerCase()}`}
    />
  )
}

;(TagSelectWidget as any).widgetName = 'tag_select'
