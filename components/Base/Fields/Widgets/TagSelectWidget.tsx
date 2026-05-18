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
  const [options, setOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const widgetConfig = field.widgetConfig as TagSelectWidgetConfig
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
