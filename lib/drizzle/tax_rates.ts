import { db, tax_rates } from './server'
import { createCrudService } from './base-crud'
import type { TaxRate } from './server'

export const taxRateService = createCrudService<TaxRate, any, any>(
  tax_rates
)

export async function fetchTaxRatesFromDrizzle(): Promise<TaxRate[]> {
  return taxRateService.search()
}

export async function fetchTaxRateFromDrizzle(id: string): Promise<TaxRate | null> {
  return taxRateService.read(id)
}

export async function deleteTaxRateFromDrizzle(id: string): Promise<boolean> {
  try {
    const result = await taxRateService.unlink(id)
    return result.success
  } catch {
    return false
  }
}
