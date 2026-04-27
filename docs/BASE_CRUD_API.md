# Base CRUD API Server Component

## Overview

The Base CRUD API Server Component provides a unified, Odoo-inspired architecture for database operations across all models in the application. It automatically handles tracking fields (`create_uid`, `write_uid`, `created_at`, `updated_at`) to ensure comprehensive audit trails.

## Architecture

### Design Philosophy

Inspired by Odoo's RPC pattern, the base CRUD service provides:
- **Automatic tracking**: All create/update operations automatically set `create_uid`, `write_uid`, `created_at`, and `updated_at`
- **Consistent API**: All models use the same CRUD operations (`create`, `read`, `search`, `write`, `unlink`)
- **Type safety**: Full TypeScript support with inferred types from Drizzle schema
- **Bulk operations**: Support for batch create, update, and delete operations

### Core Components

#### 1. BaseCrudService Class

Located at `lib/drizzle/base-crud.ts`

```typescript
class BaseCrudService<T, TInsert, TUpdate> {
  constructor(table: PgTable, userId?: string)
  
  // CRUD Operations
  create(data: TInsert): Promise<CreateResult<T>>
  createMany(dataArray: TInsert[]): Promise<CreateResult<T[]>>
  read(id: string): Promise<T | null>
  search(where?: any, options?: SearchOptions): Promise<T[]>
  write(id: string, data: TUpdate): Promise<UpdateResult>
  writeMany(ids: string[], data: TUpdate): Promise<UpdateResult>
  unlink(id: string): Promise<DeleteResult>
  unlinkMany(ids: string[]): Promise<DeleteResult>
  upsert(data: TInsert & { id: string }): Promise<CreateResult<T>>
}
```

#### 2. Tracking Fields

All models include these automatic tracking fields:

| Field | Type | Description | Set On |
|-------|------|-------------|--------|
| `created_at` | timestamp | When the record was created | Create |
| `updated_at` | timestamp | When the record was last modified | Create/Update |
| `create_uid` | text | User ID who created the record | Create |
| `write_uid` | text | User ID who last modified the record | Create/Update |

## Usage

### Creating a Service for a Model

```typescript
import { createCrudService } from './base-crud'
import { products } from '../drizzle/server'
import type { Product } from '../drizzle/server'

// Create service instance
export const productService = createCrudService<Product, any, any>(
  products,
  userId // Optional: will be used for tracking fields
)
```

### CRUD Operations

#### Create

```typescript
// Single record
const result = await productService.create({
  name: 'Product A',
  price: '100.00',
  sku: 'SKU-001'
})

// Automatically sets: created_at, updated_at, created_by, uid
if (result.success) {
  console.log('Created:', result.data)
} else {
  console.error('Error:', result.error)
}

// Multiple records
const bulkResult = await productService.createMany([
  { name: 'Product A', price: '100.00' },
  { name: 'Product B', price: '200.00' }
])
```

#### Read

```typescript
// Single record by ID
const product = await productService.read('product-id-123')

// Search with filters
const products = await productService.search(
  eq(products.status, 'published'),
  { limit: 10, offset: 0, orderBy: products.created_at }
)
```

#### Update (Write)

```typescript
// Update single record
const result = await productService.write('product-id-123', {
  name: 'Updated Product Name',
  price: '150.00'
})

// Automatically updates: updated_at, uid

// Update multiple records
const bulkResult = await productService.writeMany(
  ['id-1', 'id-2', 'id-3'],
  { status: 'archived' }
)
```

#### Delete (Unlink)

```typescript
// Delete single record
const result = await productService.unlink('product-id-123')

// Delete multiple records
const bulkResult = await productService.unlinkMany(['id-1', 'id-2', 'id-3'])
```

#### Upsert

```typescript
// Create or update based on ID existence
const result = await productService.upsert({
  id: 'product-id-123',
  name: 'Product A',
  price: '100.00'
})
```

## API Route Integration

### Example API Route

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/lib/drizzle/products'
import { getServerSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await getServerSession()
  const products = await productService.search()
  return NextResponse.json(products)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession()
  const body = await request.json()
  
  const result = await productService.create(body)
  
  if (result.success) {
    return NextResponse.json(result.data, { status: 201 })
  } else {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
}
```

### Dynamic Route

```typescript
// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { productService } from '@/lib/drizzle/products'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await productService.read(params.id)
  
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  return NextResponse.json(product)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json()
  const result = await productService.write(params.id, body)
  
  if (result.success) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const result = await productService.unlink(params.id)
  
  if (result.success) {
    return NextResponse.json({ success: true })
  } else {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }
}
```

## Model-Specific Services

### Products (`lib/drizzle/products.ts`)

```typescript
export const productService = createCrudService<Product, any, any>(products)

// Custom delete with attachment cleanup
export async function deleteProductFromDrizzle(productId: string) {
  await deleteAttachmentsByResModelAndResId('products', productId)
  return productService.unlink(productId)
}
```

### Announcements (`lib/drizzle/announcements.ts`)

```typescript
export const announcementService = createCrudService<Announcement, any, any>(announcements)
```

### Orders (`lib/drizzle/orders.ts`)

```typescript
export const orderService = createCrudService<Order, any, any>(orders)
```

### Invoices (`lib/drizzle/invoices.ts`)

```typescript
export const invoiceService = createCrudService<Invoice, any, any>(invoices)
```

### Settings (`lib/drizzle/settings.ts`)

```typescript
export const settingService = createCrudService<Setting, any, any>(settings)
```

### Configurations (`lib/drizzle/configurations.ts`)

```typescript
export const configurationService = createCrudService<Configuration, any, any>(configurations)
```

## Best Practices

### 1. User Context

Always pass the user ID to the service for tracking:

```typescript
const session = await getServerSession()
const service = createCrudService(table, session.user.id)
```

### 2. Error Handling

All operations return result objects with success/error fields:

```typescript
const result = await service.create(data)
if (!result.success) {
  // Handle error
  console.error(result.error)
}
```

### 3. Custom Logic

For models requiring custom logic (e.g., cascading deletes), wrap the service:

```typescript
export async function deleteProductWithRelations(id: string) {
  // Custom pre-delete logic
  await deleteAttachments(id)
  await deleteVariants(id)
  
  // Use service for actual delete
  return productService.unlink(id)
}
```

### 4. Search Options

Use search options for pagination and sorting:

```typescript
const results = await service.search(
  whereCondition,
  {
    limit: 20,
    offset: 0,
    orderBy: table.created_at
  }
)
```

## Migration Guide

### From Direct Drizzle Queries

**Before:**
```typescript
await db.insert(products).values({ name: 'Product A' })
await db.update(products).set({ name: 'Updated' }).where(eq(products.id, id))
await db.delete(products).where(eq(products.id, id))
```

**After:**
```typescript
await productService.create({ name: 'Product A' })
await productService.write(id, { name: 'Updated' })
await productService.unlink(id)
```

### Benefits of Migration

- **Automatic tracking**: No manual field management
- **Consistent API**: Same pattern across all models
- **Type safety**: Better TypeScript support
- **Error handling**: Standardized result objects
- **Audit trail**: Built-in user tracking

## Schema Requirements

All models must include tracking fields:

```typescript
export const tableName = pgTable('table_name', {
  id: text('id').primaryKey(),
  // ... other fields
  created_at: timestamp('created_at', { mode: 'string' }).notNull().defaultNow(),
  updated_at: timestamp('updated_at', { mode: 'string' }).notNull().defaultNow(),
  created_by: text('created_by'),
  uid: text('uid'),
})
```

## Type Definitions

### CreateResult

```typescript
interface CreateResult<T> {
  success: boolean
  data?: T
  error?: string
}
```

### UpdateResult

```typescript
interface UpdateResult {
  success: boolean
  error?: string
}
```

### DeleteResult

```typescript
interface DeleteResult {
  success: boolean
  error?: string
}
```

### SearchOptions

```typescript
interface SearchOptions {
  limit?: number
  offset?: number
  orderBy?: any
}
```

## Troubleshooting

### Issue: Tracking fields not being set

**Solution**: Ensure the schema includes `created_by` and `uid` fields and migrations have been run.

### Issue: Type errors with service

**Solution**: Use `any` for generic types if inference fails:
```typescript
createCrudService<Model, any, any>(table)
```

### Issue: Bulk operations failing

**Solution**: Check that all records in the array have required fields and valid IDs.

## Future Enhancements

- [ ] Add transaction support for multi-table operations
- [ ] Implement soft delete with `deleted_at` field
- [ ] Add validation hooks before create/update
- [ ] Support for computed fields
- [ ] Add caching layer for read operations
- [ ] Implement audit log for all changes
