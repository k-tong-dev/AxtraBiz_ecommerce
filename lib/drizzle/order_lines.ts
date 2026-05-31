import { db, order_lines } from './server'
import { createCrudService } from './base-crud'
import type { OrderLine } from './server'

export const orderLineService = createCrudService<OrderLine, any, any>(
  order_lines
)

export async function fetchOrderLinesFromDrizzle(): Promise<OrderLine[]> {
  return orderLineService.search()
}

export async function fetchOrderLineFromDrizzle(id: string): Promise<OrderLine | null> {
  return orderLineService.read(id)
}

export async function deleteOrderLineFromDrizzle(id: string): Promise<boolean> {
  const result = await orderLineService.unlink(id)
  return result.success
}
