import { db, orders } from '../drizzle/server'
import { eq } from 'drizzle-orm'
import type { Order } from '../drizzle/server'

export async function fetchOrdersFromDrizzle(): Promise<Order[]> {
  try {
    const allOrders = await db.select().from(orders)
    return allOrders
  } catch {
    return []
  }
}

export async function fetchOrderFromDrizzle(orderId: string): Promise<Order | null> {
  try {
    const [order] = await db
      .select()
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1)
    
    return order || null
  } catch {
    return null
  }
}

export async function upsertOrderInDrizzle(order: Order): Promise<{ success: boolean; error?: string }> {
  try {
    const existingOrder = await fetchOrderFromDrizzle(order.id)
    
    if (existingOrder) {
      // Update existing order
      await db
        .update(orders)
        .set(order as any)
        .where(eq(orders.id, order.id))
    } else {
      // Insert new order
      await db.insert(orders).values(order as any)
    }
    
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error occurred'
    }
  }
}

export async function deleteOrderFromDrizzle(orderId: string): Promise<boolean> {
  try {
    await db.delete(orders).where(eq(orders.id, orderId))
    return true
  } catch {
    return false
  }
}
