'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Table, Button, IconButton, Input, NumberInput, Checkbox, SelectPicker, TagPicker } from 'rsuite'
import { VscEdit, VscSave, VscRemove, VscAdd } from 'react-icons/vsc'
import { FieldWidgetProps } from './index'
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

/**
 * Many2Many Widget Configuration
 * Similar to Odoo's Many2Many field with junction table support
 */
export interface Many2ManyWidgetConfig {
  // Junction table configuration (required for many2many)
  junctionTable?: string     // API endpoint for junction records (e.g., '/api/admin/product-attributes-rel')
  localField: string         // FK to parent in junction (e.g., 'product_id')
  remoteField: string        // FK to related in junction (e.g., 'attribute_id')
  
  // Related record configuration
  relation: string           // API endpoint for related records (e.g., '/api/admin/product-attributes')
  displayField?: string      // Field to display from related record (default: 'name')
  valueField?: string        // Field to use as value (default: 'id')
  
  // Domain and context
  domain?: any               // Optional filter for related records
  context?: Record<string, any>
  
  // Inline editing of junction data
  columns?: Array<{
    key: string              // Can be a field from junction table or prefixed related record
    title: string
    width?: number
    type?: 'string' | 'number' | 'boolean' | 'select' | 'many2one' | 'tags'
    editable?: boolean
    required?: boolean
    options?: Array<{ label: string; value: string }>
    relation?: string
    displayField?: string
    valueField?: string
  }>
  
  // Display options
  mode?: 'list' | 'tags' | 'kanban'  // Display mode (default: 'list')
  
  // Actions
  allowSelect?: boolean      // Allow selecting existing records
  allowCreate?: boolean     // Allow creating new related records
  allowRemove?: boolean     // Allow removing (unlinking) records
  allowEdit?: boolean       // Allow editing junction data
}

/**
 * Many2Many Widget - Odoo-style many-to-many relationship field
 * Manages junction table records for many-to-many relationships
 */
export const Many2ManyWidget: React.FC<FieldWidgetProps> = ({
  value,
  onChange,
  field,
  data: formData,
  disabled,
  readonly
}) => {
  const [items, setItems] = useState<any[]>(value || [])
  const [relatedOptions, setRelatedOptions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showSelector, setShowSelector] = useState(false)
  const [columnOptions, setColumnOptions] = useState<Record<string, any[]>>({})
  
  const config = field.widgetConfig as Many2ManyWidgetConfig
  const parentId = formData?.id
  const mode = config.mode || 'list'
  
  // Sync with external value
  useEffect(() => {
    setItems(value || [])
  }, [value])
  
  // Fetch related records for selection
  useEffect(() => {
    const fetchRelated = async () => {
      if (!config.relation) return
      
      try {
        const response = await fetch(config.relation)
        const data = await response.json()
        
        const options = data.map((item: any) => ({
          label: item[config.displayField || 'name'],
          value: item[config.valueField || 'id'],
          ...item
        }))
        
        setRelatedOptions(options)
      } catch (error) {
        console.error('[Many2ManyWidget] Failed to fetch related records:', error)
      }
    }
    
    fetchRelated()
  }, [config.relation, config.displayField, config.valueField])
  
  // Fetch options for many2one columns
  useEffect(() => {
    const fetchOptions = async () => {
      if (!config.columns) return
      
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
            console.error(`[Many2ManyWidget] Failed to fetch options for ${col.key}:`, error)
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
  
  // Add/link existing records
  const handleSelect = (selectedValues: string[]) => {
    const newItems = selectedValues.map(value => {
      const related = relatedOptions.find(r => r.value === value)
      return {
        id: `temp_${Date.now()}_${value}`,
        [config.localField]: parentId || null,
        [config.remoteField]: value,
        _related: related,  // Store related record data
        _isNew: true
      }
    })
    
    notifyChange([...items, ...newItems])
    setShowSelector(false)
  }
  
  // Unlink (remove from list, mark for deletion)
  const handleUnlink = (id: string) => {
    console.log('[Many2ManyWidget] handleUnlink called:', { id, currentItems: items })
    
    const item = items.find(i => i.id === id)
    if (!item) {
      console.log('[Many2ManyWidget] Item not found for unlink:', id)
      return
    }
    
    console.log('[Many2ManyWidget] Item to unlink:', item)
    
    // If it's a new item, just remove it
    // If it's existing, mark for deletion
    const newItems = items.map(i => 
      i.id === id ? { ...i, _toDelete: true } : i
    ).filter(i => i._isNew ? !i._toDelete : true)
    
    console.log('[Many2ManyWidget] Items after unlink processing:', newItems)
    console.log('[Many2ManyWidget] Active items count:', newItems.filter(i => !i._toDelete).length)
    
    notifyChange(newItems)
  }
  
  // Toggle edit mode for junction data
  const handleEdit = (id: string) => {
    if (!config.allowEdit) return
    
    // Store original values when starting edit
    if (editingId !== id) {
      const item = items.find(i => i.id === id)
      if (item && config.columns) {
        const original: any = {}
        for (const col of config.columns) {
          original[col.key] = item[col.key]
        }
        setOriginalValues(prev => ({ ...prev, [id]: original }))
      }
    }
    
    setEditingId(editingId === id ? null : id)
  }
  
  // Track original values for change detection
  const [originalValues, setOriginalValues] = useState<Record<string, any>>({})
  
  // Save junction data changes
  const handleSave = (id: string) => {
    setEditingId(null)
    
    const item = items.find(i => i.id === id)
    if (!item) return
    
    // Check if any values actually changed compared to original
    const original = originalValues[id]
    let hasChanges = false
    
    if (original && config.columns) {
      for (const col of config.columns) {
        if (item[col.key] !== original[col.key]) {
          hasChanges = true
          break
        }
      }
    }
    
    // Only mark as modified if there are actual changes (not for new items)
    const newItems = items.map(item => {
      if (item.id !== id) return item
      
      if (item._isNew) {
        // New items don't need _isModified
        return { ...item }
      } else if (hasChanges) {
        // Existing items with changes
        return { ...item, _isModified: true }
      } else {
        // Existing items without changes - remove any previous _isModified
        const { _isModified, ...rest } = item
        return rest
      }
    })
    
    // Clear stored original values
    const newOriginalValues = { ...originalValues }
    delete newOriginalValues[id]
    setOriginalValues(newOriginalValues)
    
    notifyChange(newItems)
  }
  
  // Update junction field value
  const handleFieldChange = (id: string, key: string, newValue: any) => {
    const newItems = items.map(item =>
      item.id === id ? { ...item, [key]: newValue } : item
    )
    setItems(newItems)
  }
  
  // Get available options (exclude already linked)
  const getAvailableOptions = () => {
    const linkedIds = items
      .filter(i => !i._toDelete)
      .map(i => i[config.remoteField] || i.id)  // Handle new data structure
    return relatedOptions.filter(o => !linkedIds.includes(o.value))
  }
  
  // Render editable cell for junction data
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
          <SelectPicker {...commonProps} data={columnOptions[dataKey] || []} block />
        ) : column.type === 'select' ? (
          <SelectPicker {...commonProps} data={column.options || []} block />
        ) : (
          <Input {...commonProps} />
        )}
      </Cell>
    )
  }
  
  // Action cell
  const ActionCell = ({ rowData, ...props }: any) => {
    const isEditing = editingId === rowData.id
    const showEdit = config.allowEdit && !readonly && !disabled && config.columns
    const showUnlink = config.allowRemove !== false && !readonly && !disabled
    
    console.log('[Many2ManyWidget] ActionCell render:', {
      rowData,
      isEditing,
      showEdit,
      showUnlink,
      config: {
        allowEdit: config.allowEdit,
        allowRemove: config.allowRemove,
        columns: !!config.columns
      }
    })
    
    return (
      <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px' }}>
        {showEdit && (
          <IconButton
            appearance="link"
            color="violet"
            icon={isEditing ? <VscSave /> : <VscEdit />}
            onClick={() => {
              console.log('[Many2ManyWidget] Edit button clicked:', { id: rowData.id, isEditing })
              isEditing ? handleSave(rowData.id) : handleEdit(rowData.id)
            }}
            size="sm"
          />
        )}
        {showUnlink && (
          <IconButton
            appearance="link"
            icon={<VscRemove />}
            onClick={() => {
              console.log('[Many2ManyWidget] Unlink button clicked:', rowData.id)
              handleUnlink(rowData.id)
            }}
            size="sm"
            color="red"
          />
        )}
      </Cell>
    )
  }
  
  // Tags mode display
  if (mode === 'tags') {
    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {items.filter(i => !i._toDelete).map(item => {
            const related = item._related || relatedOptions.find(r => r.value === item[config.remoteField])
            return (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
              >
                {related?.label || item[config.remoteField]}
                {config.allowRemove !== false && !readonly && !disabled && (
                  <button
                    onClick={() => handleUnlink(item.id)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                )}
              </span>
            )
          })}
        </div>
        
        {config.allowSelect && !readonly && !disabled && (
          <div className="mt-2">
            <TagPicker
              data={getAvailableOptions()}
              value={[]}
              onChange={(values) => handleSelect(values as string[])}
              placeholder="Add..."
              block
              size="sm"
              style={{ outlineColor: 'transparent'}}
            />
          </div>
        )}
      </div>
    )
  }
  
  // List mode (default)
  if (readonly || disabled) {
    return (
      <div className="border rounded p-4 bg-gray-50">
        <p className="text-sm text-gray-500">
          {items.filter(i => !i._toDelete).length} linked records (read-only)
        </p>
      </div>
    )
  }
  
  const activeItems = items.filter(i => !i._toDelete)
  const shouldShowActionBar = activeItems.length > 0 || (config.allowSelect && activeItems.length === 0)

  return (
    <>
      <style>{styles}</style>
      <div className="space-y-2">
        {shouldShowActionBar && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {items.filter(i => !i._toDelete).length} linked records
            </span>
            {config.allowSelect && (
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowSelector(!showSelector)}
                  appearance="default"
                  size="sm"
                  style={{color: '#531ba8', backgroundColor: 'transparent'}}
                  disabled={disabled}
                  startIcon={<IoIosCreate />}
                >
                  Add lines
                </Button>
              </div>
            )}
          </div>
        )}
        
        {showSelector && (
          <div className="p-3 border rounded bg-gray-50">
            <TagPicker
              data={getAvailableOptions()}
              value={[]}
              creatable
              className={"text-foreground"}
              onChange={(values) => handleSelect(values as string[])}
              placeholder="Search and select records to link..."
              block
              size="sm"
              style={{ outlineColor: 'transparent'}}
            />
          </div>
        )}
        
        {config.columns ? (
          <Table
            height={300}
            data={items.filter(i => !i._toDelete)}
            autoHeight={items.filter(i => !i._toDelete).length === 0}
            bordered={false}
            cellBordered={false}
          >
            {/* Related record display column */}
            <Column flexGrow={1}>
              <HeaderCell className={"uppercase"}>{config.displayField || 'Name'}</HeaderCell>
              <Cell>
                {(rowData: any) => {
                  // API returns full data directly: name, type, position, etc.
                  // Fallback to _related for backwards compatibility or relatedOptions for new items
                  const displayValue = rowData[config.displayField || 'name'] 
                    || rowData.name 
                    || rowData._related?.label 
                    || relatedOptions.find(r => r.value === rowData[config.remoteField])?.label 
                    || rowData[config.remoteField] 
                    || '-'
                  return <span>{displayValue}</span>
                }}
              </Cell>
            </Column>
            
            {/* Junction data columns */}
            {config.columns.map((col) => (
              <Column key={col.key} width={col.width || 100}>
                <HeaderCell  className={"uppercase"}>{col.title}</HeaderCell>
                <EditableCell dataKey={col.key} column={col} />
              </Column>
            ))}
            
            <Column width={80} align="center">
              <HeaderCell className={"uppercase"}>Action</HeaderCell>
              <ActionCell dataKey="id" />
            </Column>
          </Table>
        ) : (
          // Simple list without junction data columns
          <div className="border rounded divide-y">
            {items.filter(i => !i._toDelete).map(item => {
              const related = item._related || relatedOptions.find(r => r.value === item[config.remoteField])
              return (
                <div key={item.id} className="flex justify-between items-center p-2 hover:bg-gray-50">
                  <span>{related?.label || item[config.remoteField]}</span>
                  {config.allowRemove !== false && (
                    <IconButton
                      appearance="primary"
                      icon={<VscRemove />}
                      onClick={() => handleUnlink(item.id)}
                      size="sm"
                      color="red"
                    />
                  )}
                </div>
              )
            })}
            {items.filter(i => !i._toDelete).length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No linked records
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

;(Many2ManyWidget as any).widgetName = 'many2many'

export default Many2ManyWidget
