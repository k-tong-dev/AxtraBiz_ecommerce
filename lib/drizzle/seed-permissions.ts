import { db } from './client'
import { resPermissions, resGroups, m2mGroupsPermissions } from '@/lib/drizzle/schema'
import { sql, inArray } from 'drizzle-orm'

// ─── Default permission seeds ─────────────────────────────────

export interface PermissionSeed {
  resource: string
  action: string
  key: string
}

export const defaultPermissions: PermissionSeed[] = [
  // Products
  { resource: 'products', action: 'read', key: 'read_products' },
  { resource: 'products', action: 'write', key: 'write_products' },
  { resource: 'products', action: 'delete', key: 'delete_products' },
  { resource: 'inventory', action: 'read', key: 'read_inventory' },
  { resource: 'inventory', action: 'write', key: 'write_inventory' },
  { resource: 'product_cost', action: 'read', key: 'read_product_cost' },
  { resource: 'product_cost', action: 'write', key: 'edit_product_cost' },
  { resource: 'product_price', action: 'read', key: 'read_product_price' },
  { resource: 'product_price', action: 'write', key: 'edit_product_price' },

  // Orders
  { resource: 'orders', action: 'read', key: 'read_orders' },
  { resource: 'orders', action: 'write', key: 'write_orders' },
  { resource: 'orders', action: 'delete', key: 'delete_orders' },
  { resource: 'draft_orders', action: 'read', key: 'read_draft_orders' },
  { resource: 'draft_orders', action: 'write', key: 'write_draft_orders' },
  { resource: 'draft_orders', action: 'delete', key: 'delete_draft_orders' },
  { resource: 'fulfillment', action: 'write', key: 'fulfill_orders' },
  { resource: 'returns', action: 'write', key: 'return_orders' },
  { resource: 'payments', action: 'write', key: 'capture_payments' },
  { resource: 'refunds', action: 'write', key: 'refund_orders' },
  { resource: 'cancellations', action: 'write', key: 'cancel_orders' },

  // Customers
  { resource: 'customers', action: 'read', key: 'read_customers' },
  { resource: 'customers', action: 'write', key: 'write_customers' },
  { resource: 'customers', action: 'delete', key: 'delete_customers' },
  { resource: 'customers', action: 'write', key: 'export_customers' },

  // Marketing
  { resource: 'marketing', action: 'read', key: 'read_marketing' },
  { resource: 'marketing', action: 'write', key: 'write_marketing' },
  { resource: 'marketing', action: 'delete', key: 'delete_marketing' },
  { resource: 'coupons', action: 'read', key: 'read_coupons' },
  { resource: 'coupons', action: 'write', key: 'write_coupons' },
  { resource: 'coupons', action: 'delete', key: 'delete_coupons' },
  { resource: 'reviews', action: 'read', key: 'read_reviews' },
  { resource: 'reviews', action: 'write', key: 'write_reviews' },
  { resource: 'reviews', action: 'delete', key: 'delete_reviews' },

  // Content
  { resource: 'pages', action: 'read', key: 'read_pages' },
  { resource: 'pages', action: 'write', key: 'write_pages' },
  { resource: 'pages', action: 'delete', key: 'delete_pages' },
  { resource: 'menus', action: 'read', key: 'read_menus' },
  { resource: 'menus', action: 'write', key: 'write_menus' },
  { resource: 'menus', action: 'delete', key: 'delete_menus' },

  // Settings & Configuration
  { resource: 'settings', action: 'read', key: 'read_settings' },
  { resource: 'settings', action: 'write', key: 'write_settings' },
  { resource: 'shipping', action: 'read', key: 'read_shipping' },
  { resource: 'shipping', action: 'write', key: 'write_shipping' },
  { resource: 'taxes', action: 'read', key: 'read_taxes' },
  { resource: 'taxes', action: 'write', key: 'write_taxes' },
  { resource: 'payments_config', action: 'read', key: 'read_payments_config' },
  { resource: 'payments_config', action: 'write', key: 'write_payments_config' },
  { resource: 'currencies', action: 'read', key: 'read_currencies' },
  { resource: 'currencies', action: 'write', key: 'write_currencies' },

  // Analytics & Reports
  { resource: 'reports', action: 'read', key: 'read_reports' },
  { resource: 'analytics', action: 'read', key: 'read_analytics' },
  { resource: 'dashboard', action: 'read', key: 'read_dashboard' },

  // Staff & Roles
  { resource: 'staff', action: 'read', key: 'read_staff' },
  { resource: 'staff', action: 'write', key: 'write_staff' },
  { resource: 'staff', action: 'delete', key: 'delete_staff' },
  { resource: 'roles', action: 'read', key: 'read_roles' },
  { resource: 'roles', action: 'write', key: 'write_roles' },
  { resource: 'roles', action: 'delete', key: 'delete_roles' },

  // Audit
  { resource: 'audit_logs', action: 'read', key: 'read_audit_logs' },
]

// ─── Predefined role definitions ──────────────────────────────

export interface RoleSeed {
  name: string
  description: string
  scopes: string[]
}

export const predefinedRoles: RoleSeed[] = [
  {
    name: 'Admin',
    description: 'Full access to all shop features.',
    scopes: defaultPermissions.map((p) => p.key),
  },
  {
    name: 'Order Manager',
    description: 'Manage orders, drafts, fulfillment, and returns.',
    scopes: [
      'read_orders', 'write_orders', 'delete_orders',
      'read_draft_orders', 'write_draft_orders', 'delete_draft_orders',
      'fulfill_orders', 'return_orders', 'capture_payments',
      'refund_orders', 'cancel_orders', 'read_customers', 'read_reports',
    ],
  },
  {
    name: 'Product Manager',
    description: 'Manage products, inventory, pricing, and categories.',
    scopes: [
      'read_products', 'write_products', 'delete_products',
      'read_inventory', 'write_inventory',
      'read_product_cost', 'edit_product_cost',
      'read_product_price', 'edit_product_price',
      'read_reports',
    ],
  },
  {
    name: 'Marketing Manager',
    description: 'Manage campaigns, coupons, reviews, and marketing content.',
    scopes: [
      'read_marketing', 'write_marketing', 'delete_marketing',
      'read_coupons', 'write_coupons', 'delete_coupons',
      'read_reviews', 'write_reviews', 'delete_reviews',
      'read_reports', 'read_analytics',
    ],
  },
  {
    name: 'Content Manager',
    description: 'Manage pages, menus, and media files.',
    scopes: [
      'read_pages', 'write_pages', 'delete_pages',
      'read_menus', 'write_menus', 'delete_menus',
    ],
  },
  {
    name: 'Support Agent',
    description: 'View and manage customers and orders.',
    scopes: [
      'read_customers', 'write_customers',
      'read_orders', 'write_orders',
      'read_marketing',
    ],
  },
  {
    name: 'Reports Only',
    description: 'View reports, analytics, and dashboard data.',
    scopes: [
      'read_reports', 'read_analytics', 'read_dashboard',
    ],
  },
  {
    name: 'Shipping Manager',
    description: 'Manage shipping zones, methods, and fulfill orders.',
    scopes: [
      'read_shipping', 'write_shipping',
      'read_orders', 'fulfill_orders',
    ],
  },
]

// ─── Seed function ────────────────────────────────────────────

export async function seedDefaultPermissions() {
  console.log('Seeding default permissions...')

  for (const perm of defaultPermissions) {
    await db.insert(resPermissions)
      .values(perm)
      .onConflictDoNothing({ target: resPermissions.key })
  }

  console.log(`Seeded ${defaultPermissions.length} permissions.`)

  console.log('Seeding predefined roles...')

  for (const roleDef of predefinedRoles) {
    const existing = await db.select().from(resGroups)
      .where(sql`${resGroups.name} = ${roleDef.name}`)

    if (existing.length > 0) continue

    const [role] = await db.insert(resGroups)
      .values({
        name: roleDef.name,
        description: roleDef.description,
      })
      .returning()

    const matchedPerms = await db.select().from(resPermissions)
      .where(inArray(resPermissions.key, roleDef.scopes))

    for (const perm of matchedPerms) {
      await db.insert(m2mGroupsPermissions)
        .values({ groupId: role.id, permissionId: perm.id })
        .onConflictDoNothing()
    }

    console.log(`  Created role "${roleDef.name}" with ${matchedPerms.length} permissions.`)
  }

  console.log('Seeding complete.')
}
