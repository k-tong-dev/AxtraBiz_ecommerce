import { db, resUserAddresses } from '../server'
import { createCrudService } from './base-crud'
import type { ResUserAddress } from '@/lib/drizzle/schema'

export const resUserAddressService = createCrudService<ResUserAddress, any, any>(
  resUserAddresses
)

export async function fetchResUserAddressesFromDrizzle(): Promise<ResUserAddress[]> {
  return resUserAddressService.search()
}

export async function fetchResUserAddressFromDrizzle(id: string): Promise<ResUserAddress | null> {
  return resUserAddressService.read(id)
}

export async function deleteResUserAddressFromDrizzle(id: string): Promise<boolean> {
  const result = await resUserAddressService.unlink(id)
  return result.success
}
