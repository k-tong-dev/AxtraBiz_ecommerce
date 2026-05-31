import { db, addresses } from './server'
import { createCrudService } from './base-crud'
import type { Address } from './server'

export const addressService = createCrudService<Address, any, any>(
  addresses
)

export async function fetchAddressesFromDrizzle(): Promise<Address[]> {
  return addressService.search()
}

export async function fetchAddressFromDrizzle(id: string): Promise<Address | null> {
  return addressService.read(id)
}

export async function deleteAddressFromDrizzle(id: string): Promise<boolean> {
  const result = await addressService.unlink(id)
  return result.success
}
