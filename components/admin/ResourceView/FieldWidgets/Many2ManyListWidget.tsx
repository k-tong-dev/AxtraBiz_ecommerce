'use client'

import React, { useState, useEffect } from 'react'
import { Table, Button, IconButton, Input, NumberInput, TagPicker, SelectPicker } from 'rsuite'
import { VscEdit, VscSave, VscRemove, VscAdd } from 'react-icons/vsc'
import { FieldWidgetProps, FieldWidgetComponent } from './index'
import {IoIosCreate} from "react-icons/io";

const { Column, HeaderCell, Cell } = Table

const styles = `
.table-cell-editing .rs-table-cell-content {
  padding: 4px;
}
.table-cell-editing .rs-input {
  width: 100%;
}
`

interface Many2ManyListWidgetConfig {
  relationTable?: string  // Junction table name for many2many relation
  localField?: string    // FK column in junction table that references the parent
  remoteField?: string   // FK column in junction table that references the related table
  columns: Array<{
    key: string
    title: string
    width: number
    type?: 'string' | 'number' | 'many2many_tags' | 'many2one'
    editable?: boolean
    relation?: string  // API endpoint to fetch options for this column
    displayField?: string  // Field to display in options
    valueField?: string  // Field to use as value in options
    relationTable?: string  // Junction table for this column's many2many
    localField?: string    // FK in junction table referencing parent
    remoteField?: string   // FK in junction table referencing related table
  }>
  editable?: boolean
  sortable?: boolean
  searchable?: boolean
}

export const Many2ManyListWidget: React.FC<FieldWidgetProps> = ({
  value,
  onChange,
  field,
  data,
  disabled,
  readonly
}) => {
  const [items, setItems] = useState<any[]>(value || [])
  const [loading, setLoading] = useState(false)
  const [columnOptions, setColumnOptions] = useState<Record<string, any[]>>({})

  const widgetConfig = field.widgetConfig as Many2ManyListWidgetConfig

  useEffect(() => {
    setItems(value || [])
  }, [value])

  // Fetch options for columns with relations
  useEffect(() => {
    const fetchColumnOptions = async () => {
      const newColumnOptions: Record<string, any[]> = {}
      
      for (const col of widgetConfig.columns) {
        if (col.relation) {
          try {
            const response = await fetch(col.relation)
            const data = await response.json()
            newColumnOptions[col.key] = data.map((item: any) => ({
              label: item[col.displayField || 'name'],
              value: item[col.valueField || 'id'],
              ...item
            }))
          } catch (error) {
            console.error(`Error fetching options for ${col.key}:`, error)
            newColumnOptions[col.key] = []
          }
        }
      }
      
      setColumnOptions(newColumnOptions)
    }

    fetchColumnOptions()
  }, [widgetConfig.columns])

  // Filter value options by attribute_id for value_ids column
  const getFilteredValueOptions = (attributeId: string) => {
    const allOptions = columnOptions['value_ids'] || []
    if (!attributeId) return allOptions
    return allOptions.filter((opt: any) => opt.attribute_id === attributeId)
  }

  const handleChange = (id: string, key: string, newValue: any) => {
    const nextItems = [...items]
    const item = nextItems.find(item => item.id === id)
    if (item) {
      item[key] = newValue
      setItems(nextItems)
      onChange(nextItems)
    }
  }

  const handleEdit = (id: string) => {
    const nextItems = [...items]
    const item = nextItems.find(item => item.id === id)
    if (item) {
      item._editing = item._editing ? null : true
      setItems(nextItems)
    }
  }

  const handleSave = (id: string) => {
    const nextItems = [...items]
    const item = nextItems.find(item => item.id === id)
    if (item) {
      item._editing = null
      setItems(nextItems)
      onChange(nextItems)
    }
  }

  const handleRemove = (id: string) => {
    const nextItems = items.filter(item => item.id !== id)
    setItems(nextItems)
    onChange(nextItems)
  }

  const handleAdd = () => {
    const newItem = {
      id: `temp_${Date.now()}`,
      _editing: true,
      ...widgetConfig.columns.reduce((acc, col) => ({ ...acc, [col.key]: '' }), {})
    }
    setItems([newItem, ...items])
  }

  const toValueString = (value: any, dataType?: string) => {
    if (dataType === 'number') return value?.toString() || '0'
    return value || ''
  }

  const fieldMap: Record<string, any> = {
    string: Input,
    number: NumberInput,
    many2many_tags: TagPicker,
    many2one: SelectPicker
  }

  const renderMany2ManyTags = (rowData: any, dataKey: string) => {
    const values = rowData[dataKey]
    if (!values || !Array.isArray(values) || values.length === 0) {
      return <span>-</span>
    }
    
    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
        {values.map((v: any) => (
          <span
            key={typeof v === 'object' ? v.id : v}
            style={{
              backgroundColor: '#e0e7ff',
              color: '#3730a3',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            {typeof v === 'object' ? v.name : v}
          </span>
        ))}
      </div>
    )
  }

  const EditableCell = ({ rowData, dataKey, dataType, columnEditable, columnRelation, ...props }: any) => {
    const editing = rowData._editing
    const Field = fieldMap[dataType || 'string']
    const value = rowData[dataKey]
    const text = toValueString(value, dataType)
    const [editValue, setEditValue] = useState(value)

    // Sync editValue when editing starts
    useEffect(() => {
      if (editing) {
        setEditValue(value)
      }
    }, [editing, value])
    
    // Get options for this column, filtered by attribute_id if value_ids
    let options = columnOptions[dataKey] || []
    if (dataKey === 'value_ids' && rowData.id) {
      options = getFilteredValueOptions(rowData.id)
    }

    // Special handling for 'many2many_tags' type - render as tags when not editing
    if (dataType === 'many2many_tags') {
      if (editing) {
        return (
          <Cell {...props} className="table-cell-editing">
            <TagPicker
              data={options}
              value={editValue || []}
              onChange={(newValue: any) => {
                setEditValue(newValue)
              }}
              onBlur={() => {
                handleChange(rowData.id, dataKey, editValue)
              }}
              disabled={disabled}
              block
              size="sm"
            />
          </Cell>
        )
      }
      return <Cell {...props}>{renderMany2ManyTags(rowData, dataKey)}</Cell>
    }

    // Special handling for 'many2one' type - render as select dropdown
    if (dataType === 'many2one') {
      const selectedOption = options.find((opt: any) => opt.value === value)
      const displayText = selectedOption?.label || selectedOption?.name || text
      
      if (editing) {
        return (
          <Cell {...props} className="table-cell-editing">
            <SelectPicker
              data={options}
              value={editValue}
              onChange={(newValue: any) => {
                setEditValue(newValue)
              }}
              onBlur={() => {
                handleChange(rowData.id, dataKey, editValue)
              }}
              disabled={disabled}
              block
              size="sm"
              placeholder="Select..."
            />
          </Cell>
        )
      }
      return <Cell {...props}>{displayText || '-'}</Cell>
    }

    // If column is not editable, always show as text
    if (columnEditable === false) {
      return <Cell {...props}>{text}</Cell>
    }

    return (
      <Cell
        {...props}
        className={editing ? 'table-cell-editing' : ''}
        onDoubleClick={() => {
          if (!readonly && !disabled) {
            handleEdit(rowData.id)
          }
        }}
      >
        {editing ? (
          <Field
            value={editValue}
            onChange={(newValue: any) => {
              setEditValue(newValue)
            }}
            onBlur={() => {
              handleChange(rowData.id, dataKey, editValue)
            }}
            disabled={disabled}
          />
        ) : (
          text
        )}
      </Cell>
    )
  }

  const ActionCell = ({ rowData, dataKey, ...props }: any) => {
    return (
      <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px' }}>
        <IconButton
          appearance="subtle"
          icon={rowData._editing ? <VscSave /> : <VscEdit />}
          onClick={() => {
            if (rowData._editing) {
              handleSave(rowData.id)
            } else {
              handleEdit(rowData.id)
            }
          }}
          disabled={disabled || readonly}
        />
        <IconButton
          appearance="subtle"
          icon={<VscRemove />}
          onClick={() => {
            handleRemove(rowData.id)
          }}
          disabled={disabled || readonly}
        />
      </Cell>
    )
  }

  if (readonly || disabled) {
    return (
      <div className="border rounded p-4 bg-gray-50">
        <p className="text-sm text-gray-500">
          {items.length} {items.length === 1 ? 'item' : 'items'} (read-only)
        </p>
      </div>
    )
  }

  return (
    <>
      <style>{styles}</style>
      <Button
        onClick={handleAdd}
        appearance="primary"
        size="sm"
        disabled={disabled}
        startIcon={<IoIosCreate />}
      >
        Add Record
      </Button>
      <hr className="my-4" />
      <Table
        height={300}
        data={items}
        bordered={false}
        autoHeight={items.length === 0}
      >
        {widgetConfig.columns.map((col) => (
          <Column key={col.key} flexGrow={1} width={col.width}>
            <HeaderCell>{col.title}</HeaderCell>
            <EditableCell
              dataKey={col.key}
              dataType={col.type}
              columnEditable={col.editable}
              columnRelation={col.relation}
            />
          </Column>
        ))}
        <Column width={100}>
          <HeaderCell>Action</HeaderCell>
          <ActionCell dataKey="id" />
        </Column>
      </Table>
    </>
  )
}

;(Many2ManyListWidget as any).widgetName = 'many2many_list'
