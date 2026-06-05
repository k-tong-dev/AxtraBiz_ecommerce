import { createCrudService } from './base-crud'
import { orders, type  Order } from '@/lib/drizzle/schema'

// Create CRUD service for orders
export const orderService = createCrudService<Order, any, any>(
  orders
)

// Convenience functions that match the old API
export async function fetchOrdersFromDrizzle(): Promise<Order[]> {
  return orderService.search()
}

export async function fetchOrderFromDrizzle(orderId: string): Promise<Order | null> {
  return orderService.read(orderId)
}

export async function deleteOrderFromDrizzle(orderId: string): Promise<boolean> {
  const result = await orderService.unlink(orderId)
  return result.success
}
