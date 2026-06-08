# BaseCrudService

A generic, reusable CRUD layer built on top of [Drizzle ORM](https://orm.drizzle.team/). Inspired by Odoo's `create / write / unlink` pattern, it automatically handles **tracking fields** (`created_at`, `updated_at`, `create_uid`, `write_uid`, `shop_id`) on every write operation.

---

## Table of Contents

- [Why This Exists](#why-this-exists)
- [Tracking Fields](#tracking-fields)
- [Setup](#setup)
- [API Reference](#api-reference)
    - [create](#create)
    - [read](#read)
    - [search](#search)
    - [write](#write)
    - [unlink](#unlink)
    - [upsert](#upsert)
- [Usage Examples](#usage-examples)
- [Factory Function](#factory-function)
- [How User & Shop Resolution Works](#how-user--shop-resolution-works)
- [FK Sanitization](#fk-sanitization)
- [Gotchas & Limitations](#gotchas--limitations)

---

## Why This Exists

Without this service, every feature would need to manually set `created_at`, `write_uid`, etc. on each insert/update. This layer centralises that logic so all models stay consistent with minimal boilerplate.

---

## Tracking Fields

The following fields are automatically populated. Your Drizzle schema must include the ones you want tracked — any that are absent are silently skipped.

| Field        | Set on            | Value                               |
|--------------|-------------------|-------------------------------------|
| `created_at` | `create`          | Current UTC ISO string              |
| `updated_at` | `create`, `write` | Current UTC ISO string              |
| `create_uid` | `create`          | Resolved user ID                    |
| `write_uid`  | `create`, `write` | Resolved user ID                    |
| `shop_id`    | `create`, `write` | Resolved shop ID (if column exists) |

---

## Setup

```ts
import { createCrudService } from '@/lib/services/base-crud.service'
import { productsTable } from '@/db/schema'
import type { Product, NewProduct, UpdateProduct } from '@/db/schema'

export const productService = createCrudService<Product, NewProduct, UpdateProduct>(
  productsTable
)
```

You can also instantiate directly if you need a fixed user context (e.g. migrations, scripts):

```ts
const service = new BaseCrudService<Product, NewProduct, UpdateProduct>(
  productsTable,
  'system-user-id'
)
```

---

## API Reference

### `create`

Creates one or many records. Automatically sets `created_at`, `updated_at`, `create_uid`, `write_uid`, and `shop_id`.

```ts
// Single record
const result = await productService.create({ name: 'Widget', price: 9.99 })

// Batch
const result = await productService.create([
  { name: 'Widget A', price: 9.99 },
  { name: 'Widget B', price: 14.99 },
])
```

**Returns** `CreateResult<T>` or `CreateResult<T[]>`:
```ts
{ success: true, data: T }
{ success: false, error: string }
```

---

### `read`

Fetches a single record by primary key.

```ts
const product = await productService.read(42)
// returns T | null
```

---

### `search`

Fetches multiple records with optional filtering, pagination, and ordering.

```ts
import { eq } from 'drizzle-orm'

const products = await productService.search(
  eq(productsTable.shop_id, 3),
  { limit: 20, offset: 0, orderBy: productsTable.created_at }
)
```

> ⚠️ The `where` clause is passed directly to Drizzle — use Drizzle's `eq`, `and`, `or`, etc.

---

### `write`

Updates one or many records. Automatically sets `updated_at` and `write_uid`.

```ts
// Single record
await productService.write(42, { price: 19.99 })

// Multiple records (see Gotchas — currently only first ID is applied)
await productService.write([42, 43], { active: false })
```

**Returns** `UpdateResult`:
```ts
{ success: true }
{ success: false, error: string }
```

---

### `unlink`

Deletes one or many records by ID.

```ts
await productService.unlink(42)
await productService.unlink([42, 43, 44])
```

**Returns** `DeleteResult`:
```ts
{ success: true }
{ success: false, error: string }
```

> ⚠️ See Gotchas — batch delete currently only deletes the first ID.

---

### `upsert`

Creates a record if it does not exist, updates it if it does. Requires an `id` field in the payload.

```ts
await productService.upsert({ id: 42, name: 'Widget', price: 9.99 })

// Batch
await productService.upsert([
  { id: 42, name: 'Widget A' },
  { id: 99, name: 'New Widget' },
])
```

Internally calls `read` → `write` or `create`. Each item in a batch fails fast.

---

## Usage Examples

### Server Action (Next.js)

```ts
'use server'
import { productService } from '@/lib/services/product.service'

export async function createProduct(formData: FormData) {
  return productService.create({
    name: formData.get('name') as string,
    price: Number(formData.get('price')),
  })
  // create_uid and shop_id are resolved automatically from the session/cookie
}
```

### Passing explicit IDs (scripts / migrations)

```ts
await productService.create(
  { name: 'Seeded Product', price: 0 },
  'migration-bot',   // userId override
  1                  // shopId override
)
```

---

## Factory Function

`createCrudService` is the recommended way to instantiate services — it keeps the generic types clean and matches how all existing services are set up:

```ts
export function createCrudService<T, TInsert, TUpdate>(
  table: PgTable,
  userId?: string
): BaseCrudService<T, TInsert, TUpdate>
```

---

## How User & Shop Resolution Works

Each method resolves the user and shop IDs in priority order:

**User ID**
1. Explicit `userId` argument on the method call
2. `userId` passed to the constructor
3. `getCurrentUserId()` — reads from the active Supabase session

**Shop ID**
1. Explicit `shopId` argument on the method call
2. `getCurrentShopId()` — reads from the `active_shop_id` cookie

`shop_id` is only injected if the table schema has a `shop_id` or `shopId` column (auto-detected via Drizzle column metadata).

---

## FK Sanitization

Before any insert or update, all foreign-key columns have empty strings (`""`) converted to `null`. This prevents FK constraint violations when form inputs submit empty selects.

FK columns are detected in this order:
1. Drizzle's inline FK metadata (`drizzle:PgInlineForeignKeys`)
2. Fallback: any column whose name ends in `_id`

---

## Gotchas & Limitations

**Batch write/unlink only processes the first ID.**
The current `write` and `unlink` implementations use `eq(table.id, idList[0])`. A proper `inArray` clause is needed for true multi-record updates/deletes. Until fixed, call these methods in a loop for batch operations.

**`search` chaining is broken.**
The `where`, `limit`, `offset`, and `orderBy` calls are made on a local `query` reference without re-assigning the result. Drizzle's builder is immutable, so filters are silently dropped. A rewrite using conditional builder chaining is needed.

**No soft delete.**
`unlink` performs a hard `DELETE`. If your model uses an `active` / `deleted_at` pattern, implement a custom method rather than relying on `unlink`.

**No access control.**
The service does not enforce row-level permissions. That must be handled at the API/action layer before calling into the service.