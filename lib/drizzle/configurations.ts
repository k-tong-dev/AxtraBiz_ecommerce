import { db, configurations } from '../drizzle/server'
import { eq } from 'drizzle-orm'
import type { Configuration } from '../drizzle/server'

export async function fetchConfigurationsFromDrizzle(): Promise<Configuration[]> {
  try {
    const allConfigurations = await db.select().from(configurations)
    return allConfigurations
  } catch {
    return []
  }
}

export async function fetchConfigurationFromDrizzle(configurationId: string): Promise<Configuration | null> {
  try {
    const [configuration] = await db
      .select()
      .from(configurations)
      .where(eq(configurations.id, configurationId))
      .limit(1)
    
    return configuration || null
  } catch {
    return null
  }
}

export async function upsertConfigurationInDrizzle(configuration: Configuration): Promise<{ success: boolean; error?: string }> {
  try {
    const existingConfiguration = await fetchConfigurationFromDrizzle(configuration.id)
    
    if (existingConfiguration) {
      // Update existing configuration
      await db
        .update(configurations)
        .set(configuration as any)
        .where(eq(configurations.id, configuration.id))
    } else {
      // Insert new configuration
      await db.insert(configurations).values(configuration as any)
    }
    
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

export async function deleteConfigurationFromDrizzle(configurationId: string): Promise<boolean> {
  try {
    await db.delete(configurations).where(eq(configurations.id, configurationId))
    return true
  } catch {
    return false
  }
}
