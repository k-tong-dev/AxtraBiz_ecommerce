'use client'

import { useEffect, useState, useCallback } from 'react'
import { wishlistStorage } from '@/lib/storage'
import { useAuth } from '@/hooks/use-auth'

export function useWishlist() {
  const { isAuthenticated } = useAuth()
  const [wishlist, setWishlist] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist(wishlistStorage.getWishlist())
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch('/api/wishlist')
      const data = await res.json()
      setWishlist(data.isGuest ? wishlistStorage.getWishlist() : (data.items || []))
    } catch {
      setWishlist(wishlistStorage.getWishlist())
    }
    setIsLoading(false)
  }, [isAuthenticated])

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const toggleWishlist = useCallback(async (productId: number) => {
    if (!isAuthenticated) {
      setWishlist(wishlistStorage.toggleWishlist(productId))
      return
    }

    try {
      const res = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      })
      const data = await res.json()
      setWishlist((prev) =>
        data.inWishlist ? [...prev, productId] : prev.filter((id) => id !== productId)
      )
    } catch {
      setWishlist(wishlistStorage.toggleWishlist(productId))
    }
  }, [isAuthenticated])

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
