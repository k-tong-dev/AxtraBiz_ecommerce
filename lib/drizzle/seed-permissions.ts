import { db } from './client'
import { permissions, roles, m2m_roles_permissions } from '@/drizzle/schema'
import { sql } from 'drizzle-orm'

// ─── Default permission seeds ─────────────────────────────────

export interface PermissionSeed {
  resource: string
  action: 'read' | 'write' | 'delete'
  scope: string
}

export const defaultPermissions: PermissionSeed[] = [
  // Products
  { resource: 'products', action: 'read', scope: 'read_products' },
  { resource: 'products', action: 'write', scope: 'write_products' },
  { resource: 'products', action: 'delete', scope: 'delete_products' },
  { resource: 'inventory', action: 'read', scope: 'read_inventory' },
  { resource: 'inventory', action: 'write', scope: 'write_inventory' },
  { resource: 'product_cost', action: 'read', scope: 'read_product_cost' },
  { resource: 'product_cost', action: 'write', scope: 'edit_product_cost' },
  { resource: 'product_price', action: 'read', scope: 'read_product_price' },
  { resource: 'product_price', action: 'write', scope: 'edit_product_price' },

  // Orders
  { resource: 'orders', action: 'read', scope: 'read_orders' },
  { resource: 'orders', action: 'write', scope: 'write_orders' },
  { resource: 'orders', action: 'delete', scope: 'delete_orders' },
  { resource: 'draft_orders', action: 'read', scope: 'read_draft_orders' },
  { resource: 'draft_orders', action: 'write', scope: 'write_draft_orders' },
  { resource: 'draft_orders', action: 'delete', scope: 'delete_draft_orders' },
  { resource: 'fulfillment', action: 'write', scope: 'fulfill_orders' },
  { resource: 'returns', action: 'write', scope: 'return_orders' },
  { resource: 'payments', action: 'write', scope: 'capture_payments' },
  { resource: 'refunds', action: 'write', scope: 'refund_orders' },
  { resource: 'cancellations', action: 'write', scope: 'cancel_orders' },

  // Customers
  { resource: 'customers', action: 'read', scope: 'read_customers' },
  { resource: 'customers', action: 'write', scope: 'write_customers' },
  { resource: 'customers', action: 'delete', scope: 'delete_customers' },
  { resource: 'customers', action: 'write', scope: 'export_customers' },

  // Marketing
  { resource: 'marketing', action: 'read', scope: 'read_marketing' },
  { resource: 'marketing', action: 'write', scope: 'write_marketing' },
  { resource: 'marketing', action: 'delete', scope: 'delete_marketing' },
  { resource: 'coupons', action: 'read', scope: 'read_coupons' },
  { resource: 'coupons', action: 'write', scope: 'write_coupons' },
  { resource: 'coupons', action: 'delete', scope: 'delete_coupons' },
  { resource: 'reviews', action: 'read', scope: 'read_reviews' },
  { resource: 'reviews', action: 'write', scope: 'write_reviews' },
  { resource: 'reviews', action: 'delete', scope: 'delete_reviews' },

  // Content
  { resource: 'pages', action: 'read', scope: 'read_pages' },
  { resource: 'pages', action: 'write', scope: 'write_pages' },
  { resource: 'pages', action: 'delete', scope: 'delete_pages' },
  { resource: 'menus', action: 'read', scope: 'read_menus' },
  { resource: 'menus', action: 'write', scope: 'write_menus' },
  { resource: 'menus', action: 'delete', scope: 'delete_menus' },

  // Settings & Configuration
  { resource: 'settings', action: 'read', scope: 'read_settings' },
  { resource: 'settings', action: 'write', scope: 'write_settings' },
  { resource: 'shipping', action: 'read', scope: 'read_shipping' },
  { resource: 'shipping', action: 'write', scope: 'write_shipping' },
  { resource: 'taxes', action: 'read', scope: 'read_taxes' },
  { resource: 'taxes', action: 'write', scope: 'write_taxes' },
  { resource: 'payments_config', action: 'read', scope: 'read_payments_config' },
  { resource: 'payments_config', action: 'write', scope: 'write_payments_config' },
  { resource: 'currencies', action: 'read', scope: 'read_currencies' },
  { resource: 'currencies', action: 'write', scope: 'write_currencies' },

  // Analytics & Reports
  { resource: 'reports', action: 'read', scope: 'read_reports' },
  { resource: 'analytics', action: 'read', scope: 'read_analytics' },
  { resource: 'dashboard', action: 'read', scope: 'read_dashboard' },

  // Staff & Roles
  { resource: 'staff', action: 'read', scope: 'read_staff' },
  { resource: 'staff', action: 'write', scope: 'write_staff' },
  { resource: 'staff', action: 'delete', scope: 'delete_staff' },
  { resource: 'roles', action: 'read', scope: 'read_roles' },
  { resource: 'roles', action: 'write', scope: 'write_roles' },
  { resource: 'roles', action: 'delete', scope: 'delete_roles' },

  // Audit
  { resource: 'audit_logs', action: 'read', scope: 'read_audit_logs' },
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
    scopes: defaultPermissions.map((p) => p.scope),
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
    await db.insert(permissions)
      .values(perm)
      .onConflictDoNothing({ target: permissions.scope })
  }

  console.log(`Seeded ${defaultPermissions.length} permissions.`)

  console.log('Seeding predefined roles...')

  for (const roleDef of predefinedRoles) {
    const existing = await db.select().from(roles)
      .where(sql`${roles.name} = ${roleDef.name} AND ${roles.shop_id} IS NULL`)

    if (existing.length > 0) continue

    const [role] = await db.insert(roles)
      .values({
        name: roleDef.name,
        role_type: 'predefined',
        description: roleDef.description,
      })
      .returning()

    const matchedPerms = await db.select().from(permissions)
      .where(sql`${permissions.scope} = ANY(${roleDef.scopes})`)

    for (const perm of matchedPerms) {
      await db.insert(m2m_roles_permissions)
        .values({ role_id: role.id, permission_id: perm.id })
        .onConflictDoNothing()
    }

    console.log(`  Created role "${roleDef.name}" with ${matchedPerms.length} permissions.`)
  }

  console.log('Seeding complete.')
}
