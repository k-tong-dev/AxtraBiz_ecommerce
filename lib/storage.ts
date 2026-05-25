'use client'

import type { CartItem, ShippingAddress, User } from './types'

const STORAGE_KEYS = {
  CART: 'app-cart',
  AUTH_USER: 'auth-user',
  WISHLIST: 'wishlist',
  ADDRESSES: 'shipping-addresses',
}

// Cart Storage
export const cartStorage = {
  getCart: (): CartItem[] => {
    if (typeof window === 'undefined') return []
    try {
      const cart = localStorage.getItem(STORAGE_KEYS.CART)
      return cart ? JSON.parse(cart) : []
    } catch {
      return []
    }
  },

  setCart: (cart: CartItem[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart))
  },

  clearCart: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(STORAGE_KEYS.CART)
  },
}

// Auth Storage
export const authStorage = {
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null
    try {
      const user = localStorage.getItem(STORAGE_KEYS.AUTH_USER)
      return user ? JSON.parse(user) : null
    } catch {
      return null
    }
  },

  setUser: (user: User | null) => {
    if (typeof window === 'undefined') return
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER)
    }
  },
}

// Wishlist Storage
export const wishlistStorage = {
  getWishlist: (): number[] => {
    if (typeof window === 'undefined') return []
    try {
      const wishlist = localStorage.getItem(STORAGE_KEYS.WISHLIST)
      return wishlist ? JSON.parse(wishlist) : []
    } catch {
      return []
    }
  },

  setWishlist: (wishlist: number[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist))
  },

  toggleWishlist: (productId: number) => {
    const wishlist = wishlistStorage.getWishlist()
    const index = wishlist.indexOf(productId)
    if (index > -1) {
      wishlist.splice(index, 1)
    } else {
      wishlist.push(productId)
    }
    wishlistStorage.setWishlist(wishlist)
    return wishlist
  },
}

// Address Storage
export const addressStorage = {
  getAddresses: (): ShippingAddress[] => {
    if (typeof window === 'undefined') return []
    try {
      const addresses = localStorage.getItem(STORAGE_KEYS.ADDRESSES)
      return addresses ? JSON.parse(addresses) : []
    } catch {
      return []
    }
  },

  setAddresses: (addresses: ShippingAddress[]) => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses))
  },

  addAddress: (address: ShippingAddress): ShippingAddress => {
    const addresses = addressStorage.getAddresses()
    const newAddress = {
      ...address,
      id: Date.now().toString(),
    }
    addresses.push(newAddress)
    addressStorage.setAddresses(addresses)
    return newAddress
  },

  updateAddress: (id: string, updated: ShippingAddress): ShippingAddress | null => {
    const addresses = addressStorage.getAddresses()
    const index = addresses.findIndex((a) => a.id === id)
    if (index > -1) {
      addresses[index] = { ...updated, id }
      addressStorage.setAddresses(addresses)
      return addresses[index]
    }
    return null
  },

  deleteAddress: (id: string) => {
    const addresses = addressStorage.getAddresses()
    const filtered = addresses.filter((a) => a.id !== id)
    addressStorage.setAddresses(filtered)
  },
}
