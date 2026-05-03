'use client'

import React, { useState, useEffect } from 'react'
import { Table, Button, IconButton, TagPicker, SelectPicker, Message } from 'rsuite'
import { VscAdd, VscTrash, VscSave, VscEdit } from 'react-icons/vsc'

const { Column, HeaderCell, Cell } = Table

interface ProductAttributesProps {
  value: any[]
  onChange: (value: any[]) => void
  disabled?: boolean
  readonly?: boolean
}

interface AttributeRow {
  id: string
  attribute_id: string
  value_ids: string[]
  _editing?: boolean
}

export const ProductAttributes: React.FC<ProductAttributesProps> = ({
  value = [],
  onChange,
  disabled = false,
  readonly = false
}) => {
  const [rows, setRows] = useState<AttributeRow[]>(value)
  const [attributes, setAttributes] = useState<any[]>([])
  const [attributeValues, setAttributeValues] = useState<Record<string, any[]>>({})
  const [loading, setLoading] = useState(false)

  // Fetch attributes
  useEffect(() => {
    fetch('/api/admin/product-attributes')
      .then(res => res.json())
      .then(data => {
        const options = data.map((attr: any) => ({
          label: attr.name,
          value: attr.id
        }))
        setAttributes(options)
      })
      .catch(err => console.error('Failed to fetch attributes:', err))
  }, [])

  // Fetch all attribute values
  useEffect(() => {
    fetch('/api/admin/product-attribute-values')
      .then(res => res.json())
      .then(data => {
        const valuesMap: Record<string, any[]> = {}
        data.forEach((val: any) => {
          if (!valuesMap[val.attribute_id]) {
            valuesMap[val.attribute_id] = []
          }
          valuesMap[val.attribute_id].push({
            label: val.name,
            value: val.id
          })
        })
        setAttributeValues(valuesMap)
      })
      .catch(err => console.error('Failed to fetch attribute values:', err))
  }, [])

  const handleAddRow = () => {
    const newRow: AttributeRow = {
      id: crypto.randomUUID(),
      attribute_id: '',
      value_ids: [],
      _editing: true
    }
    setRows([...rows, newRow])
  }

  const handleDeleteRow = (rowId: string) => {
    setRows(rows.filter(row => row.id !== rowId))
    onChange(rows.filter(row => row.id !== rowId))
  }

  const handleEditRow = (rowId: string) => {
    setRows(rows.map(row => 
      row.id === rowId ? { ...row, _editing: true } : row
    ))
  }

  const handleSaveRow = (rowId: string) => {
    setRows(rows.map(row => 
      row.id === rowId ? { ...row, _editing: false } : row
    ))
    onChange(rows)
  }

  const handleRowChange = (rowId: string, field: string, value: any) => {
    setRows(rows.map(row => 
      row.id === rowId ? { ...row, [field]: value } : row
    ))
  }

  const AttributeCell = ({ rowData, dataKey, ...props }: any) => {
    const editing = rowData._editing
    const value = rowData[dataKey]

    if (editing) {
      return (
        <Cell {...props}>
          <SelectPicker
            data={attributes}
            value={value}
            onChange={(newValue) => handleRowChange(rowData.id, dataKey, newValue)}
            disabled={disabled}
            block
            size="sm"
            placeholder="Select attribute..."
          />
        </Cell>
      )
    }

    const selected = attributes.find((a: any) => a.value === value)
    return <Cell {...props}>{selected?.label || '-'}</Cell>
  }

  const ValuesCell = ({ rowData, dataKey, ...props }: any) => {
    const editing = rowData._editing
    const value = rowData[dataKey] || []
    const options = attributeValues[rowData.attribute_id] || []

    if (editing) {
      return (
        <Cell {...props}>
          <TagPicker
            data={options}
            value={value}
            onChange={(newValue) => handleRowChange(rowData.id, dataKey, newValue)}
            disabled={disabled}
            block
            size="sm"
            placeholder="Select values..."
          />
        </Cell>
      )
    }

    if (!value || value.length === 0) {
      return <Cell {...props}>-</Cell>
    }

    return (
      <Cell {...props}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {value.map((v: string) => {
            const valOption = options.find((o: any) => o.value === v)
            return (
              <span
                key={v}
                style={{
                  background: '#e5e7eb',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              >
                {valOption?.label || v}
              </span>
            )
          })}
        </div>
      </Cell>
    )
  }

  const ActionCell = ({ rowData, ...props }: any) => {
    return (
      <Cell {...props} style={{ padding: '6px', display: 'flex', gap: '4px' }}>
        <IconButton
          appearance="subtle"
          icon={rowData._editing ? <VscSave /> : <VscEdit />}
          onClick={() => {
            if (rowData._editing) {
              handleSaveRow(rowData.id)
            } else {
              handleEditRow(rowData.id)
            }
          }}
          disabled={disabled || readonly}
          size="sm"
        />
        <IconButton
          appearance="subtle"
          icon={<VscTrash />}
          onClick={() => handleDeleteRow(rowData.id)}
          disabled={disabled || readonly}
          size="sm"
          color="red"
        />
      </Cell>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 500 }}>
          Manage product attributes and their values
        </span>
        {!readonly && !disabled && (
          <Button
            appearance="primary"
            size="sm"
            onClick={handleAddRow}
            startIcon={<VscAdd />}
          >
            Add Attribute
          </Button>
        )}
      </div>

      {rows.length === 0 ? (
        <div style={{ 
          padding: '40px', 
          textAlign: 'center', 
          background: '#f9fafb', 
          borderRadius: '8px',
          border: '1px dashed #d1d5db'
        }}>
          <p style={{ color: '#6b7280', marginBottom: '8px' }}>No attributes added yet</p>
          {!readonly && !disabled && (
            <Button
              appearance="ghost"
              size="sm"
              onClick={handleAddRow}
              startIcon={<VscAdd />}
            >
              Add your first attribute
            </Button>
          )}
        </div>
      ) : (
        <Table
          data={rows}
          autoHeight
          bordered
          cellBordered
          style={{ fontSize: '13px' }}
        >
          <Column width={200} resizable>
            <HeaderCell>Attribute</HeaderCell>
            <AttributeCell dataKey="attribute_id" />
          </Column>
          <Column flexGrow={1} resizable>
            <HeaderCell>Values</HeaderCell>
            <ValuesCell dataKey="value_ids" />
          </Column>
          <Column width={80} align="center">
            <HeaderCell>Actions</HeaderCell>
            <ActionCell dataKey="id" />
          </Column>
        </Table>
      )}
    </div>
  )
}
