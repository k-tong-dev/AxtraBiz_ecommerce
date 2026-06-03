# Data Model

## Enums

```sql
staff_status    → 'active' | 'invited' | 'disabled'
role_type       → 'predefined' | 'custom'
permission_action → 'read' | 'write' | 'delete'
```

## Core Tables

### shops
```sql
id, name, domain, status, created_at, updated_at
```

### staff_accounts
```sql
id, shop_id (FK → shops), email, full_name,
is_owner (boolean, default false),
status (staff_status),
last_login_at,
created_at, updated_at
```

### platform_admins (system owner)
```sql
id, email, password_hash, full_name, created_at
```

### permissions (global — system-defined)
```sql
id, resource (text), action (permission_action),
scope (text, unique), description
-- Example: { resource: "orders", action: "read", scope: "read_orders" }
```

### roles
```sql
id, shop_id (nullable → null = global predefined),
name, role_type, description,
created_at, updated_at
```

### role_permissions (junction)
```sql
role_id (FK → roles), permission_id (FK → permissions)
```

### staff_roles (junction)
```sql
staff_id (FK → staff_accounts), role_id (FK → roles)
```

### customers (storefront only)
```sql
id, shop_id (FK → shops), email, password_hash,
tags (jsonb), created_at, updated_at
```

## Resource Tables

Every resource table follows this pattern:

```sql
id, shop_id (FK → shops, NOT NULL), ...
...resource-specific columns...,
created_at, updated_at
```

Resources: orders, products, product_variants, categories, brands, inventory, coupons, announcements, pages, menus, shipping_zones, shipping_methods, tax_rates, currencies, settings, audit_logs, etc.

## Audit Columns

Every table has `created_at` and `updated_at`. Audit log entries have additional context (`action`, `actor_id`, `shop_id`, `metadata`).
