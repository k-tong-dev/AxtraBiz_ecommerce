'use client'

import { useEffect, useState, useCallback } from 'react'
import { wishlistStorage } from '@/lib/storage'

export function useWishlist() {
  const [wishlist, setWishlist] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = wishlistStorage.getWishlist()
    setWishlist(saved)
    setIsLoading(false)
  }, [])

  const toggleWishlist = useCallback((productId: string) => {
    setWishlist((prev) => {
      const newWishlist = wishlistStorage.toggleWishlist(productId)
      return newWishlist
    })
  }, [])

  const addToWishlist = useCallback((productId: string) => {
    if (!wishlist.includes(productId)) {
      toggleWishlist(productId)
    }
  }, [wishlist, toggleWishlist])

  const removeFromWishlist = useCallback((productId: string) => {
    if (wishlist.includes(productId)) {
      toggleWishlist(productId)
    }
  }, [wishlist, toggleWishlist])

  const isInWishlist = useCallback((productId: string) => {
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
