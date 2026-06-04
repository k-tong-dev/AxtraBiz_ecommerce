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
  product_template,
  orders,
  invoices,
  announcements,
  settings,
  configurations,
} from '@/drizzle/schema'

// New schema tables
export {
  resUsers, userRoleEnum,
  resGroups,
  resPermissions,
  resShops,
  resPartner, partnerTypeEnum,
  m2mUsersGroups,
  m2mGroupsPermissions,
  m2mUsersShops,
} from './schema'

// Export types
export type {
  User,
  ProductTemplate,
  Order,
  Invoice,
  Announcement,
  Setting,
  Configuration,
} from '@/drizzle/schema'

export type {
  ResUser, NewResUser,
  ResGroup, NewResGroup,
  ResPermission, NewResPermission,
  ResShop, NewResShop,
  ResPartner, NewResPartner,
  M2mUsersGroup, NewM2mUsersGroup,
  M2mGroupsPermission, NewM2mGroupsPermission,
  M2mUsersShop, NewM2mUsersShop,
} from './schema'
