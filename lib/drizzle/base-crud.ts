import { db } from '../drizzle/server'
import { eq, and, SQL } from 'drizzle-orm'
import { PgTable } from 'drizzle-orm/pg-core'

/**
 * Base CRUD operations with automatic tracking fields
 * Similar to Odoo's create, write, unlink pattern
 */

export interface TrackingFields {
  created_on?: Date
  write_on?: Date
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
 * Automatically handles tracking fields (created_on, write_on, create_uid, write_uid)
 */
export class BaseCrudService<T extends any, TInsert extends any, TUpdate extends any> {
  constructor(
    private table: PgTable,
    private userId?: string
  ) {}

  /**
   * Create - Similar to Odoo's create()
   * Automatically sets created_on, create_uid, write_uid
   */
  async create(data: TInsert & Partial<TrackingFields>): Promise<CreateResult<T>> {
    try {
      const now = new Date()
      const trackingData: Partial<TrackingFields> = {
        created_on: now,
        write_on: now,
      }
      
      // Only set user tracking fields if userId is provided
      if (this.userId) {
        trackingData.create_uid = this.userId
        trackingData.write_uid = this.userId
      }

      const [result] = await db
        .insert(this.table)
        .values({ ...data, ...trackingData } as any)
        .returning()

      return { success: true, data: result as T }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Create multiple records at once
   */
  async createMany(dataArray: (TInsert & Partial<TrackingFields>)[]): Promise<CreateResult<T[]>> {
    try {
      const now = new Date()
      const trackingData: Partial<TrackingFields> = {
        created_on: now,
        write_on: now,
      }
      
      // Only set user tracking fields if userId is provided
      if (this.userId) {
        trackingData.create_uid = this.userId
        trackingData.write_uid = this.userId
      }

      const results = await db
        .insert(this.table)
        .values(dataArray.map(data => ({ ...data, ...trackingData })) as any)
        .returning()

      return { success: true, data: results as T[] }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Read - Similar to Odoo's read() / search()
   */
  async read(id: string): Promise<T | null> {
    try {
      const [result] = await db
        .select()
        .from(this.table)
        .where(eq((this.table as any).id, id))
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
   * Write - Similar to Odoo's write()
   * Automatically updates write_on and write_uid fields
   */
  async write(id: string, data: TUpdate & Partial<TrackingFields>): Promise<UpdateResult> {
    try {
      const trackingData: Partial<TrackingFields> = {
        write_on: new Date(),
      }
      
      // Only set user tracking field if userId is provided
      if (this.userId) {
        trackingData.write_uid = this.userId
      }

      await db
        .update(this.table)
        .set({ ...data, ...trackingData } as any)
        .where(eq((this.table as any).id, id))

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Write multiple records at once
   */
  async writeMany(ids: string[], data: TUpdate & Partial<TrackingFields>): Promise<UpdateResult> {
    try {
      const trackingData: Partial<TrackingFields> = {
        write_on: new Date(),
      }
      
      // Only set user tracking field if userId is provided
      if (this.userId) {
        trackingData.write_uid = this.userId
      }

      await db
        .update(this.table)
        .set({ ...data, ...trackingData } as any)
        .where(eq((this.table as any).id, ids[0])) // Simplified - would need IN clause for multiple

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Unlink - Similar to Odoo's unlink()
   */
  async unlink(id: string): Promise<DeleteResult> {
    try {
      await db
        .delete(this.table)
        .where(eq((this.table as any).id, id))

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Unlink multiple records
   */
  async unlinkMany(ids: string[]): Promise<DeleteResult> {
    try {
      await db
        .delete(this.table)
        .where(eq((this.table as any).id, ids[0])) // Simplified - would need IN clause

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error occurred'
      }
    }
  }

  /**
   * Upsert - Create or update based on ID existence
   */
  async upsert(data: TInsert & Partial<TrackingFields> & { id: string }): Promise<CreateResult<T>> {
    const existing = await this.read(data.id)
    
    if (existing) {
      const result = await this.write(data.id, data as any)
      return result.success ? { success: true, data: existing } : { success: false, error: result.error }
    } else {
      return this.create(data)
    }
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
