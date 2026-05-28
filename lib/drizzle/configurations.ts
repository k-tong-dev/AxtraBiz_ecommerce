import { db, configurations } from '../drizzle/server'
import { createCrudService } from './base-crud'
import type { Configuration } from '../drizzle/server'

// Create CRUD service for configurations
export const configurationService = createCrudService<Configuration, any, any>(
  configurations
)

// Convenience functions that match the old API
export async function fetchConfigurationsFromDrizzle(): Promise<Configuration[]> {
  return configurationService.search()
}

export async function fetchConfigurationFromDrizzle(configurationId: string): Promise<Configuration | null> {
  return configurationService.read(configurationId)
}

export async function deleteConfigurationFromDrizzle(configurationId: string): Promise<boolean> {
  const result = await configurationService.unlink(configurationId)
  return result.success
}
