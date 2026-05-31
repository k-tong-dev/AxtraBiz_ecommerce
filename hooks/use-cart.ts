'use client'

import { useEffect, useState, useCallback } from 'react'
import type { CartItem, Product } from '@/lib/types'
import { cartStorage } from '@/lib/storage'
import { useAuth } from '@/hooks/use-auth'

interface ApiCartItem {
  id: number
  productId: number
  variantId: number | null
  quantity: number
  price: string
}

export function useCart() {
  const { user, isAuthenticated } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setItems(cartStorage.getCart())
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/cart')
      const data = await res.json()
      if (data.isGuest) {
        setItems(cartStorage.getCart())
      } else {
        setItems(
          (data.items || []).map((i: ApiCartItem) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: Number(i.price) || 0,
          }))
        )
      }
    } catch {
      setItems(cartStorage.getCart())
    }
    setIsLoading(false)
  }, [isAuthenticated])

  useEffect(() => {
    fetchCart()
  }, [fetchCart])

  const addItem = useCallback(
    async (product: Product, quantity: number = 1) => {
      if (!isAuthenticated) {
        setItems((prevItems) => {
          const existingItem = prevItems.find((item) => item.productId === product.id)
          const newItems = existingItem
            ? prevItems.map((item) =>
                item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
              )
            : [...prevItems, { productId: product.id, quantity, price: product.price }]
          cartStorage.setCart(newItems)
          return newItems
        })
        return
      }

      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: product.id, quantity }),
        })
        await fetchCart()
      } catch {
        // fall back to local
        setItems((prevItems) => {
          const existingItem = prevItems.find((item) => item.productId === product.id)
          const newItems = existingItem
            ? prevItems.map((item) =>
                item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
              )
            : [...prevItems, { productId: product.id, quantity, price: product.price }]
          cartStorage.setCart(newItems)
          return newItems
        })
      }
    },
    [isAuthenticated, fetchCart]
  )

  const removeItem = useCallback(
    async (productId: number) => {
      if (!isAuthenticated) {
        setItems((prevItems) => {
          const newItems = prevItems.filter((item) => item.productId !== productId)
          cartStorage.setCart(newItems)
          return newItems
        })
        return
      }

      try {
        await fetch(`/api/cart?product_id=${productId}`, { method: 'DELETE' })
        setItems((prevItems) => prevItems.filter((item) => item.productId !== productId))
      } catch {
        setItems((prevItems) => {
          const newItems = prevItems.filter((item) => item.productId !== productId)
          cartStorage.setCart(newItems)
          return newItems
        })
      }
    },
    [isAuthenticated]
  )

  const updateQuantity = useCallback(
    async (productId: number, quantity: number) => {
      if (!isAuthenticated) {
        return setItems((prevItems) => {
          const newItems =
            quantity <= 0
              ? prevItems.filter((item) => item.productId !== productId)
              : prevItems.map((item) => (item.productId === productId ? { ...item, quantity } : item))
          cartStorage.setCart(newItems)
          return newItems
        })
      }

      if (quantity <= 0) {
        return removeItem(productId)
      }

      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product_id: productId, quantity, mode: 'set' }),
        })
        await fetchCart()
      } catch {
        setItems((prevItems) =>
          prevItems.map((item) => (item.productId === productId ? { ...item, quantity } : item))
        )
      }
    },
    [isAuthenticated, removeItem, fetchCart]
  )

  const clearCart = useCallback(async () => {
    setItems([])
    cartStorage.clearCart()
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return {
    items,
    isLoading,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}
