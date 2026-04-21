'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Trash2, Copy } from 'lucide-react'

interface Variant {
  id?: string
  name: string
  sku: string
  price: number
  compare_price: number
  cost_price: number
  stock: number
  weight: number
  barcode: string
  active: boolean
  attributes: Record<string, string>
}

interface Attribute {
  name: string
  values: string[]
}

interface VariantManagerProps {
  productType?: string
  variants: Variant[]
  attributes: Attribute[]
  onVariantsChange: (variants: Variant[]) => void
  onAttributesChange: (attributes: Attribute[]) => void
}

export function VariantManager({
  productType,
  variants,
  attributes,
  onVariantsChange,
  onAttributesChange
}: VariantManagerProps) {
  const [showAddAttribute, setShowAddAttribute] = useState(false)
  const [newAttributeName, setNewAttributeName] = useState('')
  const [newAttributeValue, setNewAttributeValue] = useState('')

  // Only show for variable products
  if (productType !== 'variable') {
    return null
  }

  const addAttributeValue = (attributeName: string, value: string) => {
    const updatedAttributes = attributes.map(attr => {
      if (attr.name === attributeName) {
        return {
          ...attr,
          values: [...attr.values, value]
        }
      }
      return attr
    })
    onAttributesChange(updatedAttributes)
  }

  const removeAttributeValue = (attributeName: string, value: string) => {
    const updatedAttributes = attributes.map(attr => {
      if (attr.name === attributeName) {
        return {
          ...attr,
          values: attr.values.filter(v => v !== value)
        }
      }
      return attr
    })
    onAttributesChange(updatedAttributes)
  }

  const addAttribute = () => {
    if (newAttributeName && newAttributeValue) {
      const existingAttr = attributes.find(a => a.name === newAttributeName)
      if (existingAttr) {
        addAttributeValue(newAttributeName, newAttributeValue)
      } else {
        onAttributesChange([...attributes, { name: newAttributeName, values: [newAttributeValue] }])
      }
      setNewAttributeName('')
      setNewAttributeValue('')
      setShowAddAttribute(false)
    }
  }

  const removeAttribute = (attributeName: string) => {
    onAttributesChange(attributes.filter(a => a.name !== attributeName))
  }

  const addVariant = () => {
    const newVariant: Variant = {
      id: crypto.randomUUID(),
      name: 'New Variant',
      sku: '',
      price: 0,
      compare_price: 0,
      cost_price: 0,
      stock: 0,
      weight: 0,
      barcode: '',
      active: true,
      attributes: {}
    }
    onVariantsChange([...variants, newVariant])
  }

  const updateVariant = (index: number, field: keyof Variant, value: any) => {
    const updatedVariants = [...variants]
    updatedVariants[index] = { ...updatedVariants[index], [field]: value }
    onVariantsChange(updatedVariants)
  }

  const removeVariant = (index: number) => {
    onVariantsChange(variants.filter((_, i) => i !== index))
  }

  const duplicateVariant = (index: number) => {
    const variant = variants[index]
    const newVariant: Variant = {
      ...variant,
      id: crypto.randomUUID(),
      name: `${variant.name} (Copy)`
    }
    onVariantsChange([...variants, newVariant])
  }

  return (
    <div className="space-y-6 border-t pt-6">
      <h3 className="text-lg font-semibold">Product Variants</h3>

      {/* Attributes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Attributes</h4>
          <Button
            size="sm"
            onClick={() => setShowAddAttribute(!showAddAttribute)}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Attribute
          </Button>
        </div>

        {showAddAttribute && (
          <div className="flex gap-2 p-4 bg-muted rounded-lg">
            <Input
              placeholder="Attribute name (e.g., Color, Size)"
              value={newAttributeName}
              onChange={(e) => setNewAttributeName(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Value (e.g., Red, M)"
              value={newAttributeValue}
              onChange={(e) => setNewAttributeValue(e.target.value)}
              className="flex-1"
            />
            <Button onClick={addAttribute}>Add</Button>
            <Button className="border border-input" onClick={() => setShowAddAttribute(false)}>
              Cancel
            </Button>
          </div>
        )}

        {attributes.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No attributes defined. Add attributes to create variants.
          </p>
        )}

        {attributes.map((attribute) => (
          <div key={attribute.name} className="p-4 border rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h5 className="font-medium">{attribute.name}</h5>
              <Button
                size="sm"
                className="hover:bg-accent"
                onClick={() => removeAttribute(attribute.name)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {attribute.values.map((value) => (
                <div
                  key={value}
                  className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {value}
                  <button
                    onClick={() => removeAttributeValue(attribute.name, value)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </div>
              ))}
              <Input
                placeholder="Add value..."
                className="w-32 h-8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    addAttributeValue(attribute.name, e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Variants Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Variants ({variants.length})</h4>
          <Button
            size="sm"
            onClick={addVariant}
            className="gap-2"
            disabled={attributes.length === 0}
          >
            <Plus className="w-4 h-4" />
            Add Variant
          </Button>
        </div>

        {variants.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No variants created. Add attributes first, then create variants.
          </p>
        )}

        {variants.map((variant, index) => (
          <div key={variant.id || index} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <Input
                placeholder="Variant name"
                value={variant.name}
                onChange={(e) => updateVariant(index, 'name', e.target.value)}
                className="flex-1"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="hover:bg-accent"
                  onClick={() => duplicateVariant(index)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  className="hover:bg-accent"
                  onClick={() => removeVariant(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium">SKU</label>
                <Input
                  value={variant.sku}
                  onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                  placeholder="SKU"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Price</label>
                <Input
                  type="number"
                  value={variant.price}
                  onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Compare Price</label>
                <Input
                  type="number"
                  value={variant.compare_price}
                  onChange={(e) => updateVariant(index, 'compare_price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Cost Price</label>
                <Input
                  type="number"
                  value={variant.cost_price}
                  onChange={(e) => updateVariant(index, 'cost_price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Stock</label>
                <Input
                  type="number"
                  value={variant.stock}
                  onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Weight (kg)</label>
                <Input
                  type="number"
                  value={variant.weight}
                  onChange={(e) => updateVariant(index, 'weight', parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium">Barcode</label>
                <Input
                  value={variant.barcode}
                  onChange={(e) => updateVariant(index, 'barcode', e.target.value)}
                  placeholder="Barcode"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-medium">Active</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateVariant(index, 'active', !variant.active)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      variant.active ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        variant.active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-sm">{variant.active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
            </div>

            {/* Variant Attributes Selection */}
            {attributes.length > 0 && (
              <div className="space-y-2 pt-2 border-t">
                <label className="text-xs font-medium">Variant Attributes</label>
                <div className="flex flex-wrap gap-2">
                  {attributes.map((attr) => (
                    <div key={attr.name} className="flex items-center gap-2">
                      <span className="text-sm font-medium">{attr.name}:</span>
                      <select
                        value={variant.attributes[attr.name] || ''}
                        onChange={(e) => {
                          const updatedAttributes = { ...variant.attributes, [attr.name]: e.target.value }
                          updateVariant(index, 'attributes', updatedAttributes)
                        }}
                        className="px-3 py-1 border rounded-md text-sm"
                      >
                        <option value="">Select {attr.name}</option>
                        {attr.values.map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
