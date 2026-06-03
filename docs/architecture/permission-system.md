# Permission System

Modeled after Shopify's granular scope system.

## Tables

```
permissions (global — system-defined)
├── id, resource, action, scope (unique), description
└── Example: { resource: "orders", action: "read", scope: "read_orders" }

roles (per shop — or global predefined)
├── id, shop_id, name, role_type, description
├── role_type: 'predefined' | 'custom'
└── Predefined roles: Admin, Order Manager, Product Manager, Marketing, Reports...

role_permissions (junction)
├── role_id, permission_id
└── Which permissions a role grants

staff_roles (junction)
├── staff_id, role_id
└── Which roles a staff member has
```

## Permission Check Flow

```
Request: staff writes a product
  → 1. Is is_owner? → YES → allow (bypass all checks)
  → 2. Load staff_roles → load role_permissions → collect scope list
  → 3. Does scope list contain "write_products"? → YES → allow
  → 4. NO → deny with 403
```

## Owner Bypass

`is_owner=true` on `staff_accounts` = implicit full access. No role/permission check runs. This is NOT a role — it's a boolean flag that short-circuits all authorization.

## Predefined Roles (Shopify-style seeds)

| Role            | Scopes                                             |
|-----------------|----------------------------------------------------|
| Admin           | All scopes                                         |
| Order Manager   | read_orders, write_orders, refund_orders, ...      |
| Product Manager | read_products, write_products, read_inventory, ... |
| Marketing       | read_marketing, write_marketing, read_reports, ... |
| Reports         | read_reports, read_analytics, ...                  |

Custom roles (shop admin can create) are built by picking individual scopes from the global list — same permission check logic.
