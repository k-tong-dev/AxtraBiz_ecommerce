import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '@/drizzle/schema'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set')
}

const client = postgres(process.env.DATABASE_URL, { prepare: false })
export const db = drizzle(client, { schema })

// Re-export all schema tables so API routes can import them alongside `db`
export * from '@/drizzle/schema'
