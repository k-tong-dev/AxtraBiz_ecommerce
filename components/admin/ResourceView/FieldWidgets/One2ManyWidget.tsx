'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Table, Button, IconButton, Input, NumberInput, Checkbox, SelectPicker } from 'rsuite'
import { VscEdit, VscSave, VscRemove, VscAdd } from 'react-icons/vsc'
import { FieldWidgetProps } from './index'

const { Column, HeaderCell, Cell } = Table

const styles = `
.table-cell-editing .rs-table-cell-content {
  padding: 4px;
}
.table-cell-editing .rs-input {
  width: 100%;
}
`

/**
 * One2Many Widget Configuration
 * Similar to Odoo's One2Many field
 */
export interface One2ManyWidgetConfig {
  relation: string           // API endpoint for child records (e.g., '/api/admin/product-variants')
  inverseField: string       // FK field in child that references parent (e.g., 'product_id')
  domain?: any               // Optional domain filter for records
  context?: Record<string, any>  // Context passed to child operations
  
  // Column definitions for inline editing
  columns: Array<{
    key: string
    title: string
    width?: number
    type?: 'string' | 'number' | 'boolean' | 'select' | 'many2one'
    editable?: boolean
    required?: boolean
    options?: Array<{ label: string; value: string }>  // For select type
    relation?: string          // For many2one type - API endpoint
    displayField?: string      // For many2one type - field to display
    valueField?: string        // For many2one type - field to use as value
  }>
  
  // Actions
  allowCreate?: boolean      // Allow creating new records inline
  allowEdit?: boolean       // Allow editing existing records
  allowDelete?: boolean     // Allow deleting records
  allowImport?: boolean     // Allow importing records
}

export const One2ManyWidget: React.FC<FieldWidgetProps> = ({
  value,
  onChange,
  field,
  data: formData,
  disabled,
  readonly
}) => {
  const [items, setItems] = useState<any[]>(value || [])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [columnOptions, setColumnOptions] = useState<Record<string, any[]>>({})
  
  const config = field.widgetConfig as One2ManyWidgetConfig
  const parentId = formData?.id
  
  // Sync with external value
  useEffect(() => {
    setItems(value || [])
  }, [value])
  
  // Fetch options for many2one columns
  useEffect(() => {
    const fetchOptions = async () => {
      const newOptions: Record<string, any[]> = {}
      
      for (const col of config.columns) {
        if (col.type === 'many2one' && col.relation) {
          try {
            const response = await fetch(col.relation)
            const data = await response.json()
            newOptions[col.key] = data.map((item: any) => ({
              label: item[col.displayField || 'name'],
              value: item[col.valueField || 'id']
            }))
          } catch (error) {
            console.error(`[One2ManyWidget] Failed to fetch options for ${col.key}:`, error)
          }
        }
      }
      
      setColumnOptions(newOptions)
    }
    
    fetchOptions()
  }, [config.columns])
  
  // Notify parent of changes
  const notifyChange = useCallback((newItems: any[]) => {
    setItems(newItems)
    onChange(newItems)
  }, [onChange])
  
  // Add new record
  const handleAdd = () => {
    if (!config.allowCreate) return
    
    const newId = `temp_${Date.now()}`
    const newItem: any = {
      id: newId,
      [config.inverseField]: parentId || null,
      _isNew: true,
      _editing: true
    }
    
    // Initialize empty values for all columns
    config.columns.forEach(col => {
      if (col.type === 'boolean') {
        newItem[col.key] = false
      } else if (col.type === 'number') {
        newItem[col.key] = 0
      } else {
        newItem[col.key] = ''
      }
    })
    
    notifyChange([...items, newItem])
    setEditingId(newId)
  }
  
  // Delete record
  const handleDelete = (id: string) => {
    if (!config.allowDelete) return
    
    const newItems = items.filter(item => item.id !== id)
    notifyChange(newItems)
  }
  
  // Toggle edit mode
  const handleEdit = (id: string) => {
    if (!config.allowEdit) return
    
    setEditingId(editingId === id ? null : id)
  }
  
  // Save record
  const handleSave = (id: string) => {
    setEditingId(null)
    
    // Mark as modified (for server sync)
    const newItems = items.map(item => 
      item.id === id ? { ...item, _isModified: !item._isNew } : item
    )
    notifyChange(newItems)
  }
  
  // Update field value
  const handleFieldChange = (id: string, key: string, newValue: any) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, [key]: newValue } : item
    )
    setItems(newItems)
  }
  
  // Render editable cell
  const EditableCell = ({ rowData, dataKey, column, ...props }: any) => {
    const isEditing = editingId === rowData.id && column.editable !== false
    const value = rowData[dataKey]
    
    if (!isEditing) {
      // Display mode
      if (column.type === 'boolean') {
        return <Cell {...props}>{value ? 'Yes' : 'No'}</Cell>
      }
      if (column.type === 'many2one') {
        const options = columnOptions[dataKey] || []
        const selected = options.find((o: any) => o.value === value)
        return <Cell {...props}>{selected?.label || value || '-'}</Cell>
      }
      if (column.type === 'select') {
        const selected = column.options?.find((o: any) => o.value === value)
        return <Cell {...props}>{selected?.label || value || '-'}</Cell>
      }
      return <Cell {...props}>{value || '-'}</Cell>
    }
    
    // Edit mode
    const commonProps = {
      value,
      onChange: (newValue: any) => handleFieldChange(rowData.id, dataKey, newValue),
      disabled,
      size: 'sm' as const
    }
    
    return (
      <Cell {...props} className="table-cell-editing">
        {column.type === 'boolean' ? (
          <Checkbox {...commonProps} checked={value} />
        ) : column.type === 'number' ? (
          <NumberInput {...commonProps} />
        ) : column.type === 'many2one' ? (
          <SelectPicker
            {...commonProps}
            data={columnOptions[dataKey] || []}
            block
            placeholder={`Select ${column.title}...`}
          />
        ) : column.type === 'select' ? (
          <SelectPicker
            {...commonProps}
            data={column.options || []}
            block
          />
        ) : (
          <Input {...commonProps} placeholder={column.title} />
        )}
      </Cell>
    )
  }
  
  // Action cell
  const ActionCell = ({ rowData, ...props }: any) => {
    const isEditing = editingId === rowData.id
    const showEdit = config.allowEdit && !readonly && !disabled
    const showDelete = config.allowDelete && !readonly && !disabled
    
    return (
      <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px' }}>
        {showEdit && (
          <IconButton
            appearance="subtle"
            icon={isEditing ? <VscSave /> : <VscEdit />}
            onClick={() => isEditing ? handleSave(rowData.id) : handleEdit(rowData.id)}
            size="sm"
          />
        )}
        {showDelete && (
          <IconButton
            appearance="subtle"
            icon={<VscRemove />}
            onClick={() => handleDelete(rowData.id)}
            size="sm"
            color="red"
          />
        )}
      </Cell>
    )
  }
  
  if (readonly || disabled) {
    return (
      <div className="border rounded p-4 bg-gray-50">
        <p className="text-sm text-gray-500">
          {items.length} {items.length === 1 ? 'record' : 'records'} (read-only)
        </p>
      </div>
    )
  }
  
  return (
    <>
      <style>{styles}</style>
      <div className="space-y-2">
        {config.allowCreate && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {items.length} {items.length === 1 ? 'record' : 'records'}
            </span>
            <Button
              onClick={handleAdd}
              appearance="primary"
              size="sm"
              disabled={disabled}
              startIcon={<VscAdd />}
            >
              Add
            </Button>
          </div>
        )}
        
        <Table
          height={300}
          data={items}
          autoHeight={items.length === 0}
          bordered
          cellBordered
        >
          {config.columns.map((col) => (
            <Column key={col.key} flexGrow={1} width={col.width || 100}>
              <HeaderCell>{col.title}</HeaderCell>
              <EditableCell dataKey={col.key} column={col} />
            </Column>
          ))}
          
          {(config.allowEdit || config.allowDelete) && (
            <Column width={80} align="center">
              <HeaderCell>Action</HeaderCell>
              <ActionCell dataKey="id" />
            </Column>
          )}
        </Table>
        
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500 border rounded bg-gray-50">
            <p>No records. Click "Add" to create one.</p>
          </div>
        )}
      </div>
    </>
  )
}

;(One2ManyWidget as any).widgetName = 'one2many'

export default One2ManyWidget
