import { db } from '../client';
import { resPermissions } from '@/lib/drizzle/schema';

export async function seedPermissions() {
  await db.insert(resPermissions).values([
    // Products
    { key: 'read_products',       resource: 'products',       action: 'read'   },
    { key: 'write_products',      resource: 'products',       action: 'write'  },
    { key: 'delete_products',     resource: 'products',       action: 'delete' },
    { key: 'read_inventory',      resource: 'inventory',      action: 'read'   },
    { key: 'write_inventory',     resource: 'inventory',      action: 'write'  },
    { key: 'read_product_cost',   resource: 'product_cost',   action: 'read'   },
    { key: 'edit_product_cost',   resource: 'product_cost',   action: 'write'  },
    { key: 'read_product_price',  resource: 'product_price',  action: 'read'   },
    { key: 'edit_product_price',  resource: 'product_price',  action: 'write'  },
    // Orders
    { key: 'read_orders',         resource: 'orders',         action: 'read'   },
    { key: 'write_orders',        resource: 'orders',         action: 'write'  },
    { key: 'delete_orders',       resource: 'orders',         action: 'delete' },
    { key: 'fulfill_orders',      resource: 'fulfillment',    action: 'write'  },
    { key: 'return_orders',       resource: 'returns',        action: 'write'  },
    { key: 'refund_orders',       resource: 'refunds',        action: 'write'  },
    { key: 'cancel_orders',       resource: 'cancellations',  action: 'write'  },
    { key: 'capture_payments',    resource: 'payments',       action: 'write'  },
    { key: 'read_draft_orders',   resource: 'draft_orders',   action: 'read'   },
    { key: 'write_draft_orders',  resource: 'draft_orders',   action: 'write'  },
    { key: 'delete_draft_orders', resource: 'draft_orders',   action: 'delete' },
    // Customers
    { key: 'read_customers',      resource: 'customers',      action: 'read'   },
    { key: 'write_customers',     resource: 'customers',      action: 'write'  },
    { key: 'delete_customers',    resource: 'customers',      action: 'delete' },
    { key: 'export_customers',    resource: 'customers',      action: 'write'  },
    // Marketing
    { key: 'read_marketing',      resource: 'marketing',      action: 'read'   },
    { key: 'write_marketing',     resource: 'marketing',      action: 'write'  },
    { key: 'delete_marketing',    resource: 'marketing',      action: 'delete' },
    { key: 'read_coupons',        resource: 'coupons',        action: 'read'   },
    { key: 'write_coupons',       resource: 'coupons',        action: 'write'  },
    { key: 'delete_coupons',      resource: 'coupons',        action: 'delete' },
    // Reviews
    { key: 'read_reviews',        resource: 'reviews',        action: 'read'   },
    { key: 'write_reviews',       resource: 'reviews',        action: 'write'  },
    { key: 'delete_reviews',      resource: 'reviews',        action: 'delete' },
    // Pages & Menus
    { key: 'read_pages',          resource: 'pages',          action: 'read'   },
    { key: 'write_pages',         resource: 'pages',          action: 'write'  },
    { key: 'delete_pages',        resource: 'pages',          action: 'delete' },
    { key: 'read_menus',          resource: 'menus',          action: 'read'   },
    { key: 'write_menus',         resource: 'menus',          action: 'write'  },
    { key: 'delete_menus',        resource: 'menus',          action: 'delete' },
    // Settings & Config
    { key: 'read_settings',       resource: 'settings',       action: 'read'   },
    { key: 'write_settings',      resource: 'settings',       action: 'write'  },
    { key: 'read_payments_config',resource: 'payments_config',action: 'read'   },
    { key: 'write_payments_config',resource:'payments_config',action: 'write'  },
    { key: 'read_shipping',       resource: 'shipping',       action: 'read'   },
    { key: 'write_shipping',      resource: 'shipping',       action: 'write'  },
    { key: 'read_taxes',          resource: 'taxes',          action: 'read'   },
    { key: 'write_taxes',         resource: 'taxes',          action: 'write'  },
    { key: 'read_currencies',     resource: 'currencies',     action: 'read'   },
    { key: 'write_currencies',    resource: 'currencies',     action: 'write'  },
    // Staff & Roles
    { key: 'read_staff',          resource: 'staff',          action: 'read'   },
    { key: 'write_staff',         resource: 'staff',          action: 'write'  },
    { key: 'delete_staff',        resource: 'staff',          action: 'delete' },
    { key: 'read_roles',          resource: 'roles',          action: 'read'   },
    { key: 'write_roles',         resource: 'roles',          action: 'write'  },
    { key: 'delete_roles',        resource: 'roles',          action: 'delete' },
    // Analytics & Reports
    { key: 'read_dashboard',      resource: 'dashboard',      action: 'read'   },
    { key: 'read_analytics',      resource: 'analytics',      action: 'read'   },
    { key: 'read_reports',        resource: 'reports',        action: 'read'   },
    { key: 'read_audit_logs',     resource: 'audit_logs',     action: 'read'   },
  ]).onConflictDoNothing();

  console.log('✅ Permissions seeded');
}