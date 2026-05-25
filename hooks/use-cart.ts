'use client'

import { useEffect, useState, useCallback } from 'react'
import type { CartItem, Product } from '@/lib/types'
import { cartStorage } from '@/lib/storage'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedCart = cartStorage.getCart()
    setItems(savedCart)
    setIsLoading(false)
  }, [])

  const addItem = useCallback(
    (product: Product, quantity: number = 1) => {
      setItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.productId === product.id)
        let newItems: CartItem[]

        if (existingItem) {
          newItems = prevItems.map((item) =>
            item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
          )
        } else {
          newItems = [...prevItems, { productId: product.id, quantity, price: product.price }]
        }

        cartStorage.setCart(newItems)
        return newItems
      })
    },
    []
  )

  const removeItem = useCallback((productId: number) => {
    setItems((prevItems) => {
      const newItems = prevItems.filter((item) => item.productId !== productId)
      cartStorage.setCart(newItems)
      return newItems
    })
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prevItems) => {
      let newItems: CartItem[]
      if (quantity <= 0) {
        newItems = prevItems.filter((item) => item.productId !== productId)
      } else {
        newItems = prevItems.map((item) =>
          item.productId === productId ? { ...item, quantity } : item
        )
      }
      cartStorage.setCart(newItems)
      return newItems
    })
  }, [])

  const clearCart = useCallback(() => {
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
