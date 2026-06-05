import { createCrudService } from './base-crud'
import { shipping_methods, type ShippingMethod } from '@/lib/drizzle/schema'

export const shippingMethodService = createCrudService<ShippingMethod, any, any>(
  shipping_methods
)

export async function fetchShippingMethodsFromDrizzle(): Promise<ShippingMethod[]> {
  return shippingMethodService.search()
}

export async function fetchShippingMethodFromDrizzle(id: string): Promise<ShippingMethod | null> {
  return shippingMethodService.read(id)
}

export async function deleteShippingMethodFromDrizzle(id: string): Promise<boolean> {
  try {
    const result = await shippingMethodService.unlink(id)
    return result.success
  } catch {
    return false
  }
}
