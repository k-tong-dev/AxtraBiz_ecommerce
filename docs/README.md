# Luxe — Platform Architecture

Multi-tenant eCommerce platform where each **client** owns 1+ **shops**, and each shop has its own **staff**, **customers**, and **resources** — all isolated by `shop_id`.

## Who's Who

| Role                    | Description                                                                                  |
|-------------------------|----------------------------------------------------------------------------------------------|
| **System Owner**        | Platform admin — manages shops, billing, and predefined permissions. Not scoped to any shop. |
| **Shop Admin** (Client) | Owner of a shop. Creates staff, manages resources. One client can own multiple shops.        |
| **Staff**               | Invited by shop admin. Has limited permissions based on assigned roles/scopes.               |
| **Customer**            | Storefront user — separate table, separate auth, no admin access.                            |

## Core Principles

1. **Multi-tenancy** — every resource table has `shop_id`. No cross-shop data leaks.
2. **Permission-first** — all scopes are predefined by system owner. Roles are just named groups of scopes.
3. **Owner bypass** — shop admin (`is_owner=true`) skips all permission checks within their shop.
4. **Staff ≤ Owner** — staff can never exceed the owner's access level.
5. **Two auth layers** — platform admins authenticate separately from shop staff.

## Directory Structure

```
docs/
├── README.md                 ← this file
├── architecture/
│   ├── multi-tenancy.md      ← shop isolation, shop_id/shop_ids pattern
│   ├── auth-flow.md          ← platform vs shop vs customer auth
│   └── permission-system.md  ← roles, scopes, permission checks
├── system/
│   ├── data-model.md         ← all tables, relationships, enums
│   └── seed-data.md          ← default permissions, predefined roles
└── flows/
    ├── shop-switch.md        ← switching shops, context refresh
    ├── staff-invitation.md   ← invite → accept → active flow
    └── permission-check.md   ← runtime permission verification
```
