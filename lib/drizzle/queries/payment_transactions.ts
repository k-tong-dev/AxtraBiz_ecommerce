import { createCrudService } from './base-crud'
import { payment_transactions, PaymentTransaction } from '@/lib/drizzle/schema'

export const paymentTransactionService = createCrudService<PaymentTransaction, any, any>(
  payment_transactions
)

export async function fetchPaymentTransactionsFromDrizzle(): Promise<PaymentTransaction[]> {
  return paymentTransactionService.search()
}

export async function fetchPaymentTransactionFromDrizzle(id: string): Promise<PaymentTransaction | null> {
  return paymentTransactionService.read(id)
}

export async function deletePaymentTransactionFromDrizzle(id: string): Promise<boolean> {
  const result = await paymentTransactionService.unlink(id)
  return result.success
}
