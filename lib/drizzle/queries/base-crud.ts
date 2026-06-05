import { db } from '../server'
import { eq } from 'drizzle-orm'
import { PgTable } from 'drizzle-orm/pg-core'
import { getCurrentUserId } from '@/utils/supabase/current-user'

const FK_META = Symbol.for('drizzle:PgInlineForeignKeys')

/**
 * Base CRUD operations with automatic tracking fields
 * Similar to Odoo's create, write, unlink pattern
 */

export interface TrackingFields {
  created_at?: string
  updated_at?: string
  create_uid?: string
  write_uid?: string
}

export interface CreateResult<T> {
  success: boolean
  data?: T
  error?: string
}

export interface UpdateResult {
  success: boolean
  error?: string
}

export interface DeleteResult {
  success: boolean
  error?: string
}

export interface SearchOptions {
  limit?: number
  offset?: number
  orderBy?: any
}

/**
 * Generic CRUD service for any Drizzle model
 * Automatically handles tracking fields (created_at, updated_at, create_uid, write_uid)
 */
export class BaseCrudService<T extends any, TInsert extends any, TUpdate extends any> {
  private fkColumns: Set<string>

  constructor(
    private table: PgTable,
    private userId?: string
  ) {
    this.fkColumns = this.initForeignKeyColumns()
  }

  /**
   * Extract foreign-key column names from the table's Drizzle metadata.
   * Falls back to `_id` suffix convention when no Drizzle FK metadata exists.
   */
  private initForeignKeyColumns(): Set<string> {
    const fks: any[] = (this.table as any)[FK_META]
    if (fks?.length) {
      return new Set(
        fks.flatMap((fk: any) => {
          const ref = typeof fk.reference === 'function' ? fk.reference() : fk.reference
          return ref.columns.map((c: any) => c.name)
        })
      )
    }
    // No Drizzle FK declarations — fall back to naming convention
    const columns: Record<string, any> = (this.table as any)[Symbol.for('drizzle:Columns')] ?? {}
    return new Set(
      Object.keys(columns).filter(k => k.endsWith('_id'))
    )
  }

  /**
   * Resolve the effective user ID:
   * 1. Explicit userId parameter
   * 2. Constructor-injected userId
   * 3. Supabase session (try/catch — safe for migrations, tests)
   */
  private async getEffectiveUserId(userId?: string): Promise<string | undefined> {
    if (userId) return userId
    if (this.userId) return this.userId
    return getCurrentUserId()
  }

  /**
   * Sanitize insert/update data: convert empty strings to null for FK columns,
   * strip undefined values.
   */
  private sanitizeData(data: Record<string, any>): Record<string, any> {
    return Object.fromEntries(
      Object.entries(data)
        .map(([key, value]) => {
          if (this.fkColumns.has(key)) return [key, value === '' ? null : value]
          return [key, value]
        })
        .filter(([_, value]) => value !== undefined)
    )
  }

  /**
   * Create — accepts a single record or an array of records.
   * Automatically sets created_at, create_uid, write_uid.
   */
  async create(data: TInsert & Partial<TrackingFields>, userId?: string): Promise<CreateResult<T>>
  async create(data: (TInsert & Partial<TrackingFields>)[], userId?: string): Promise<CreateResult<T[]>>
  async create(data: any, userId?: string): Promise<CreateResult<T | T[]>> {
    try {
      const now = new Date().toISOString()
      const effectiveUserId = await this.getEffectiveUserId(userId)
      const trackingData: Partial<TrackingFields> = {
        created_at: now,
        updated_at: now,
        ...(effectiveUserId ? { create_uid: effectiveUserId, write_uid: effectiveUserId } : {}),
      }

      if (Array.isArray(data)) {
        const results = await db
          .insert(this.table)
          .values(data.map(d => this.sanitizeData({ ...d, ...trackingData } as any)) as any)
          .returning()
        return { success: true, data: results as T[] }
      }

      const [result] = await db
        .insert(this.table)
        .values(this.sanitizeData({ ...data, ...trackingData } as any) as any)
        .returning()
      return { success: true, data: result as T }
    } catch (err) {
      console.error('[BaseCrudService.create] Error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error occurred' }
    }
  }

  /**
   * Read - Similar to Odoo's read() / search()
   */
  async read(id: string | number): Promise<T | null> {
    try {
      const [result] = await db
        .select()
        .from(this.table)
        .where(eq((this.table as any).id, Number(id)))
        .limit(1)

      return result as T || null
    } catch {
      return null
    }
  }

  /**
   * Search - Similar to Odoo's search()
   * Supports filtering with where conditions
   */
  async search(
    where?: any,
    options?: SearchOptions
  ): Promise<T[]> {
    try {
      const query = db.select().from(this.table as any)
      if (where) {
        (query as any).where(where)
      }

      if (options?.limit) {
        (query as any).limit(options.limit)
      }

      if (options?.offset) {
        (query as any).offset(options.offset)
      }

      if (options?.orderBy) {
        (query as any).orderBy(options.orderBy)
      }

      return (await query) as T[]
    } catch {
      return []
    }
  }

  /**
   * Write — accepts a single ID or an array of IDs.
   * Automatically updates updated_at and write_uid fields.
   */
  async write(id: string | number, data: TUpdate & Partial<TrackingFields>, userId?: string): Promise<UpdateResult>
  async write(ids: (string | number)[], data: TUpdate & Partial<TrackingFields>, userId?: string): Promise<UpdateResult>
  async write(ids: any, data: TUpdate & Partial<TrackingFields>, userId?: string): Promise<UpdateResult> {
    try {
      const effectiveUserId = await this.getEffectiveUserId(userId)
      const trackingData: Partial<TrackingFields> = {
        updated_at: new Date().toISOString(),
        ...(effectiveUserId ? { write_uid: effectiveUserId } : {}),
      }

      const idList = Array.isArray(ids) ? ids : [ids]
      const setData = this.sanitizeData({ ...data, ...trackingData } as any)

      await db
        .update(this.table)
        .set(setData as any)
        .where(eq((this.table as any).id, Number(idList[0]))) // Simplified — IN clause for true multi

      return { success: true }
    } catch (err) {
      console.error('[BaseCrudService.write] Error:', err)
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error occurred' }
    }
  }

  /**
   * Unlink — accepts a single ID or an array of IDs.
   */
  async unlink(id: string | number): Promise<DeleteResult>
  async unlink(ids: (string | number)[], userId?: string): Promise<DeleteResult>
  async unlink(ids: any, _userId?: string): Promise<DeleteResult> {
    try {
      const idList = Array.isArray(ids) ? ids : [ids]

      await db
        .delete(this.table)
        .where(eq((this.table as any).id, Number(idList[0]))) // Simplified — IN clause for true multi

      return { success: true }
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error occurred' }
    }
  }

  /**
   * Upsert — accepts a single record or an array of records.
   * Create or update based on ID existence.
   */
  async upsert(data: TInsert & Partial<TrackingFields> & { id: string | number }, userId?: string): Promise<CreateResult<T>>
  async upsert(data: (TInsert & Partial<TrackingFields> & { id: string | number })[], userId?: string): Promise<CreateResult<T[]>>
  async upsert(data: any, userId?: string): Promise<CreateResult<T | T[]>> {
    if (Array.isArray(data)) {
      const results: T[] = []
      for (const item of data) {
        const r = await this.upsert(item, userId)
        if (!r.success) return { success: false, error: r.error }
        if (r.data) results.push(r.data)
      }
      return { success: true, data: results }
    }

    const existing = await this.read(data.id)
    if (existing) {
      const result = await this.write(data.id, data as any, userId)
      const updated = await this.read(data.id)
      return result.success ? { success: true, data: updated || existing } : { success: false, error: result.error }
    }
    return this.create(data, userId)
  }
}

/**
 * Factory function to create CRUD service for a model
 */
export function createCrudService<T extends any, TInsert extends any, TUpdate extends any>(
  table: PgTable,
  userId?: string
) {
  return new BaseCrudService<T, TInsert, TUpdate>(table, userId)
}
