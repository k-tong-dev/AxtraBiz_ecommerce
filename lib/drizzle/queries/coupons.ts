import { createCrudService } from './base-crud'
import { coupons, type  Coupon } from '../schema'

export const couponService = createCrudService<Coupon, any, any>(
  coupons
)

export async function fetchCouponsFromDrizzle(): Promise<Coupon[]> {
  return couponService.search()
}

export async function fetchCouponFromDrizzle(id: string): Promise<Coupon | null> {
  return couponService.read(id)
}

export async function deleteCouponFromDrizzle(id: string): Promise<boolean> {
  try {
    const result = await couponService.unlink(id)
    return result.success
  } catch {
    return false
  }
}
