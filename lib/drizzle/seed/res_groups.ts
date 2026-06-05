import { db } from '../client';
import { resGroups, m2mGroupsPermissions, resPermissions } from '@/lib/drizzle/schema';
import { eq, inArray } from 'drizzle-orm';

const PERMISSION_KEYS = {
  products:     ['read_products', 'write_products', 'delete_products'],
  inventory:    ['read_inventory', 'write_inventory'],
  productCost:  ['read_product_cost', 'edit_product_cost'],
  productPrice: ['read_product_price', 'edit_product_price'],
  orders:       ['read_orders', 'write_orders', 'delete_orders'],
  fulfillment:  ['fulfill_orders', 'return_orders', 'refund_orders', 'cancel_orders'],
  payments:     ['capture_payments'],
  draftOrders:  ['read_draft_orders', 'write_draft_orders', 'delete_draft_orders'],
  customers:    ['read_customers', 'write_customers', 'delete_customers', 'export_customers'],
  marketing:    ['read_marketing', 'write_marketing', 'delete_marketing'],
  coupons:      ['read_coupons', 'write_coupons', 'delete_coupons'],
  reviews:      ['read_reviews', 'write_reviews', 'delete_reviews'],
  pages:        ['read_pages', 'write_pages', 'delete_pages'],
  menus:        ['read_menus', 'write_menus', 'delete_menus'],
  settings:     ['read_settings', 'write_settings'],
  paymentsCfg:  ['read_payments_config', 'write_payments_config'],
  shipping:     ['read_shipping', 'write_shipping'],
  taxes:        ['read_taxes', 'write_taxes'],
  currencies:   ['read_currencies', 'write_currencies'],
  staff:        ['read_staff', 'write_staff', 'delete_staff'],
  roles:        ['read_roles', 'write_roles', 'delete_roles'],
  analytics:    ['read_dashboard', 'read_analytics', 'read_reports', 'read_audit_logs'],
} as const;

async function getPermissionIdsByKeys(keys: string[]) {
  const rows = await db
    .select({ id: resPermissions.id })
    .from(resPermissions)
    .where(inArray(resPermissions.key, keys));
  return rows.map(r => r.id);
}

async function seedGroup(name: string, description: string, permissionKeys: string[]) {
  const [group] = await db.insert(resGroups).values({ name, description }).returning();
  const permissionIds = await getPermissionIdsByKeys(permissionKeys);
  if (permissionIds.length > 0) {
    await db.insert(m2mGroupsPermissions).values(
      permissionIds.map(permissionId => ({ groupId: group.id, permissionId }))
    );
  }
  return group;
}

export async function seedGroups() {
  // Admin — full access
  await seedGroup('Admin', 'Full system access', Object.values(PERMISSION_KEYS).flat());

  // Manager — everything except staff/roles management
  await seedGroup('Manager', 'Operational management',
    [
      ...PERMISSION_KEYS.products,
      ...PERMISSION_KEYS.inventory,
      ...PERMISSION_KEYS.productCost,
      ...PERMISSION_KEYS.productPrice,
      ...PERMISSION_KEYS.orders,
      ...PERMISSION_KEYS.fulfillment,
      ...PERMISSION_KEYS.payments,
      ...PERMISSION_KEYS.draftOrders,
      ...PERMISSION_KEYS.customers,
      ...PERMISSION_KEYS.marketing,
      ...PERMISSION_KEYS.coupons,
      ...PERMISSION_KEYS.reviews,
      ...PERMISSION_KEYS.pages,
      ...PERMISSION_KEYS.menus,
      ...PERMISSION_KEYS.settings,
      ...PERMISSION_KEYS.paymentsCfg,
      ...PERMISSION_KEYS.shipping,
      ...PERMISSION_KEYS.taxes,
      ...PERMISSION_KEYS.currencies,
      ...PERMISSION_KEYS.analytics,
    ]
  );

  // Staff — read-only plus order fulfillment
  await seedGroup('Staff', 'Order processing and inventory view',
    [
      ...PERMISSION_KEYS.products.filter(k => k.startsWith('read_')),
      ...PERMISSION_KEYS.inventory.filter(k => k.startsWith('read_')),
      'read_product_cost',
      'read_product_price',
      ...PERMISSION_KEYS.orders.filter(k => k.startsWith('read_')),
      ...PERMISSION_KEYS.fulfillment,
      ...PERMISSION_KEYS.payments,
      ...PERMISSION_KEYS.draftOrders.filter(k => k.startsWith('read_')),
      ...PERMISSION_KEYS.customers.filter(k => k.startsWith('read_')),
      'read_analytics',
      'read_dashboard',
    ]
  );

  // Content Manager — products, pages, menus, marketing
  await seedGroup('Content Manager', 'Manage products, pages, menus and marketing',
    [
      ...PERMISSION_KEYS.products,
      ...PERMISSION_KEYS.productPrice.filter(k => k.startsWith('read_')),
      ...PERMISSION_KEYS.marketing,
      ...PERMISSION_KEYS.coupons,
      ...PERMISSION_KEYS.reviews.filter(k => k.startsWith('read_')),
      ...PERMISSION_KEYS.pages,
      ...PERMISSION_KEYS.menus,
    ]
  );

  // Support — customers, orders, reviews
  await seedGroup('Support', 'Customer service and order management',
    [
      ...PERMISSION_KEYS.orders.filter(k => k.startsWith('read_')),
      ...PERMISSION_KEYS.customers,
      ...PERMISSION_KEYS.reviews,
      'refund_orders',
      'return_orders',
      'cancel_orders',
    ]
  );

  // Marketer — marketing, coupons, analytics
  await seedGroup('Marketer', 'Marketing campaigns and analytics',
    [
      ...PERMISSION_KEYS.marketing,
      ...PERMISSION_KEYS.coupons,
      ...PERMISSION_KEYS.analytics,
      ...PERMISSION_KEYS.products.filter(k => k.startsWith('read_')),
    ]
  );

  // Analyst — read-only analytics, reports, audit
  await seedGroup('Analyst', 'View reports and analytics',
    [
      ...PERMISSION_KEYS.analytics,
      'read_orders',
      'read_customers',
      'read_products',
    ]
  );

  // Shipping — shipping, orders, inventory
  await seedGroup('Shipping', 'Manage shipping and fulfillment',
    [
      ...PERMISSION_KEYS.shipping,
      ...PERMISSION_KEYS.orders,
      ...PERMISSION_KEYS.fulfillment.filter(k => k !== 'refund_orders'),
      ...PERMISSION_KEYS.inventory,
    ]
  );

  console.log('✅ Groups seeded with permissions');
}
