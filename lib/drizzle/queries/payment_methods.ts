import { createCrudService } from './base-crud'
import { payment_methods, PaymentMethod } from '@/lib/drizzle/schema'

export const paymentMethodService = createCrudService<PaymentMethod, any, any>(
  payment_methods
)

export async function fetchPaymentMethodsFromDrizzle(): Promise<PaymentMethod[]> {
  return paymentMethodService.search()
}

export async function fetchPaymentMethodFromDrizzle(id: string): Promise<PaymentMethod | null> {
  return paymentMethodService.read(id)
}

export async function deletePaymentMethodFromDrizzle(id: string): Promise<boolean> {
  const result = await paymentMethodService.unlink(id)
  return result.success
}
