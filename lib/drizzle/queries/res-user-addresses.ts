import { createCrudService } from './base-orm/base-crud'
import { resUserAddresses, type ResUserAddress } from '@/lib/drizzle/schema'

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
