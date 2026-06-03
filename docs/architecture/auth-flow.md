# Auth Flows — Three Layers

## 1. System Owner (Platform Admin)

```
Login at /console
  → Authenticate against platform_admins table
  → No shop_id scope — sees ALL shops
  → Can manage: shops, billing, predefined permissions
```

## 2. Shop Admin & Staff

```
Login at /admin
  → Authenticate against staff_accounts WHERE email = ? AND shop_id = ?
  → Scoped to ONE shop at a time
  → If is_owner=true → full access inside that shop (bypasses permission checks)
  → If is_owner=false → checked against roles/permissions
```

## 3. Customer (Storefront)

```
Login at /account (or /shop/login)
  → Authenticate against customers table
  → NO admin access whatsoever
  → Scoped to their own data (orders, addresses, wishlist)
```

## Key Rules

- **No crossover** — a staff account cannot be a customer, and vice versa
- **Shop context** — staff always log in WITH a shop context (either by URL subdomain, header, or explicit shop selection)
- **Session carries shop_id** — once authenticated, the user's session stores `{ user_id, shop_id, is_owner, roles[] }`
