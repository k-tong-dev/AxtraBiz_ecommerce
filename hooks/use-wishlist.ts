'use client'

import { useEffect, useState, useCallback } from 'react'
import { wishlistStorage } from '@/lib/storage'

export function useWishlist() {
  const [wishlist, setWishlist] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = wishlistStorage.getWishlist()
    setWishlist(saved)
    setIsLoading(false)
  }, [])

  const toggleWishlist = useCallback((productId: number) => {
    setWishlist((prev) => {
      const newWishlist = wishlistStorage.toggleWishlist(productId)
      return newWishlist
    })
  }, [])

  const addToWishlist = useCallback((productId: number) => {
    if (!wishlist.includes(productId)) {
      toggleWishlist(productId)
    }
  }, [wishlist, toggleWishlist])

  const removeFromWishlist = useCallback((productId: number) => {
    if (wishlist.includes(productId)) {
      toggleWishlist(productId)
    }
  }, [wishlist, toggleWishlist])

  const isInWishlist = useCallback((productId: number) => {
    return wishlist.includes(productId)
  }, [wishlist])

  return {
    wishlist,
    isLoading,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  }
}
