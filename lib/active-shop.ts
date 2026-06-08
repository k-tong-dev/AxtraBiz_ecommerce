export const ACTIVE_SHOP_KEY = 'active_shop_id'

export function setActiveShop(shopId: number | string) {
  const id = String(shopId)
  if (typeof window !== 'undefined') {
    localStorage.setItem(ACTIVE_SHOP_KEY, id)
    document.cookie = `${ACTIVE_SHOP_KEY}=${id}; path=/; max-age=86400`
  }
}

export function getActiveShop(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACTIVE_SHOP_KEY)
}
