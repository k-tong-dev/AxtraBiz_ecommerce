// Server-only Drizzle client - DO NOT import in client components
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from '../../drizzle/schema'

// For server-side usage only
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false })
export const db = drizzle(client, { schema })

// Export all tables for easy access
export {
  users,
  products,
  orders,
  invoices,
  announcements,
  settings,
  configurations,
} from '../../drizzle/schema'

// Export types
export type {
  User,
  Product,
  Order,
  Invoice,
  Announcement,
  Setting,
  Configuration,
} from '../../drizzle/schema'
