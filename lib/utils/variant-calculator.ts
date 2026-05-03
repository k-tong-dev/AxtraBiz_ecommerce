/**
 * Variant Calculator
 * 
 * Calculates product variants based on attribute values using Cartesian product.
 * 
 * Example:
 * - Size: [M, L, S] = 3 variants
 * - Size: [M, L, S] × Color: [Red] = 3 variants
 * - Size: [M, L, S] × Color: [Red, Blue] = 6 variants
 */

export interface AttributeValue {
  id: string
  attribute_id: string
  name: string
  value: string
  position: number | null
}

export interface Attribute {
  id: string
  name: string
  type: string
  values: AttributeValue[]
}

export interface Variant {
  id?: string
  name: string
  attributes: Record<string, string>  // attribute_id -> value_id
  sku?: string | null
  barcode?: string | null
  price?: string | null
  compare_price?: string | null
  cost_price?: string | null
  stock?: number
  weight?: string | null
  active?: boolean
}

/**
 * Calculate variants from attributes using Cartesian product
 */
export function calculateVariants(attributes: Attribute[]): Variant[] {
  if (!attributes || attributes.length === 0) {
    return []
  }

  // Filter attributes that have values
  const attributesWithValues = attributes.filter(attr => attr.values && attr.values.length > 0)

  if (attributesWithValues.length === 0) {
    return []
  }

  // Generate Cartesian product of all attribute values
  const cartesianProduct = (arrays: AttributeValue[][]): AttributeValue[][] => {
    if (arrays.length === 0) return [[]]
    if (arrays.length === 1) return arrays[0].map(item => [item])
    
    const [first, ...rest] = arrays
    const restProduct = cartesianProduct(rest)
    
    return first.flatMap(item => 
      restProduct.map(combination => [item, ...combination])
    )
  }

  // Prepare arrays of values for each attribute
  const valueArrays = attributesWithValues.map(attr => 
    attr.values.sort((a, b) => (a.position || 0) - (b.position || 0))
  )

  // Generate all combinations
  const combinations = cartesianProduct(valueArrays)

  // Convert combinations to variants
  const variants: Variant[] = combinations.map((combination, index) => {
    const attributesMap: Record<string, string> = {}
    const nameParts: string[] = []

    combination.forEach((value, idx) => {
      const attr = attributesWithValues[idx]
      attributesMap[attr.id] = value.id
      nameParts.push(value.name)
    })

    return {
      name: nameParts.join(' - '),
      attributes: attributesMap,
      sku: '',
      barcode: '',
      price: '0',
      compare_price: '0',
      cost_price: '0',
      stock: 0,
      weight: '0',
      active: true
    }
  })

  return variants
}

/**
 * Compare existing variants with calculated variants to determine changes
 */
export function compareVariants(
  existingVariants: Variant[],
  calculatedVariants: Variant[]
): {
  toAdd: Variant[]
  toUpdate: Variant[]
  toRemove: Variant[]
  unchanged: Variant[]
} {
  const toAdd: Variant[] = []
  const toUpdate: Variant[] = []
  const toRemove: Variant[] = []
  const unchanged: Variant[] = []

  // Create a map of existing variants by their attribute signature
  const existingMap = new Map<string, Variant>()
  existingVariants.forEach(variant => {
    const signature = JSON.stringify(variant.attributes)
    existingMap.set(signature, variant)
  })

  // Check each calculated variant
  calculatedVariants.forEach(calculated => {
    const signature = JSON.stringify(calculated.attributes)
    const existing = existingMap.get(signature)

    if (existing) {
      // Variant exists, check if it needs update
      if (existing.name !== calculated.name) {
        toUpdate.push({ ...existing, ...calculated, id: existing.id })
      } else {
        unchanged.push(existing)
      }
      existingMap.delete(signature)
    } else {
      // New variant
      toAdd.push(calculated)
    }
  })

  // Remaining variants in existingMap need to be removed
  toRemove.push(...Array.from(existingMap.values()))

  return { toAdd, toUpdate, toRemove, unchanged }
}

/**
 * Generate SKU for a variant based on attributes
 */
export function generateVariantSKU(
  productSku: string,
  attributes: Record<string, string>,
  attributeValues: Map<string, AttributeValue>
): string {
  if (!productSku) return ''
  
  const parts = [productSku]
  
  Object.entries(attributes).forEach(([attrId, valueId]) => {
    const value = attributeValues.get(valueId)
    if (value) {
      parts.push(value.value.toUpperCase())
    }
  })
  
  return parts.join('-')
}

/**
 * Generate variant name from attribute values
 */
export function generateVariantName(
  attributes: Record<string, string>,
  attributeValues: Map<string, AttributeValue>
): string {
  const parts: string[] = []
  
  Object.entries(attributes).forEach(([attrId, valueId]) => {
    const value = attributeValues.get(valueId)
    if (value) {
      parts.push(value.name)
    }
  })
  
  return parts.join(' - ')
}
