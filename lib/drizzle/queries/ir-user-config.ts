import { db, irUserConfig } from '../server'
import { createCrudService } from './base-crud'
import type { IrUserConfig } from '@/lib/drizzle/schema'

export const irUserConfigService = createCrudService<IrUserConfig, any, any>(
  irUserConfig
)

export async function fetchIrUserConfigsFromDrizzle(): Promise<IrUserConfig[]> {
  return irUserConfigService.search()
}

export async function fetchIrUserConfigFromDrizzle(id: string): Promise<IrUserConfig | null> {
  return irUserConfigService.read(id)
}

export async function deleteIrUserConfigFromDrizzle(id: string): Promise<boolean> {
  const result = await irUserConfigService.unlink(id)
  return result.success
}
