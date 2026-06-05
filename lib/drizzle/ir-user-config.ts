import { db, irUserConfig } from '../drizzle/server'
import { createCrudService } from './base-crud'
import type { IrUserConfig } from '../drizzle/server'

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
