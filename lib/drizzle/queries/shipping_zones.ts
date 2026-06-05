import { db, shipping_zones } from '../server'
import { createCrudService } from './base-crud'
import type { ShippingZone } from '@/lib/drizzle/schema'

export const shippingZoneService = createCrudService<ShippingZone, any, any>(
  shipping_zones
)

export async function fetchShippingZonesFromDrizzle(): Promise<ShippingZone[]> {
  return shippingZoneService.search()
}

export async function fetchShippingZoneFromDrizzle(id: string): Promise<ShippingZone | null> {
  return shippingZoneService.read(id)
}

export async function deleteShippingZoneFromDrizzle(id: string): Promise<boolean> {
  try {
    const result = await shippingZoneService.unlink(id)
    return result.success
  } catch {
    return false
  }
}
