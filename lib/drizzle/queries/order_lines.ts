import { createCrudService } from './base-orm/base-crud'
import { order_lines, OrderLine } from '@/lib/drizzle/schema'

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
