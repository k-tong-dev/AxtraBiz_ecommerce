# Multi-Tenancy — Shop Isolation

Every resource table has a `shop_id` column (foreign key to `shops.id`). This is the **tenant boundary** — no query ever crosses it.

## Two Scoping Fields

| Field      | When                                                                                                 |
|------------|------------------------------------------------------------------------------------------------------|
| `shop_id`  | The shop that **owns** this record. Used on every resource table.                                    |
| `shop_ids` | (Optional) For records shared across multiple shops. E.g., a staff member assigned to shops A and B. |

## Enforcement

Every API query MUST include:

```sql
WHERE shop_id = current_shop_id
-- OR (for shared records)
WHERE current_shop_id = ANY(shop_ids)
```

A runtime guard function `checkShopAccess(user, record)` raises an error if the user's shop context doesn't match the record's `shop_id`/`shop_ids`.

## Tables

All scoped by `shop_id`:
- `staff_accounts`, `customers`, `orders`, `products`, `inventory`, `coupons`, `settings`, `shipping_zones`, `shipping_methods`, `tax_rates`, `pages`, `announcements`, etc.

Not scoped (global):
- `permissions` — predefined by system owner
- `shops` — the tenants themselves
- `platform_admins` — system-level users
