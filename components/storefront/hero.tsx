/* eslint-disable react/no-unknown-property */
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Sparkles } from 'lucide-react'

type Product = {
  id: string
  name: string
  themeColor: string
  image: string
  category: string
  price: number
}

const PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Headphones', themeColor: '#6366F1', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', category: 'Audio', price: 199.99 },
  { id: '2', name: 'Luxury Smartwatch', themeColor: '#06B6D4', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', category: 'Wearables', price: 349.99 },
  { id: '3', name: 'Professional Camera', themeColor: '#F59E0B', image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80', category: 'Photography', price: 1299.99 },
  { id: '4', name: 'Ultra-Light Laptop', themeColor: '#8B5CF6', image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80', category: 'Computers', price: 899.99 },
  { id: '6', name: 'Gaming Keyboard', themeColor: '#EC4899', image: 'https://images.unsplash.com/photo-1587829191301-75371900bb80?w=500&q=80', category: 'Gaming', price: 149.99 },
]

function mod(n: number, m: number) {
  return ((n % m) + m) % m
}

function hexToRgba(hex: string, alpha: number) {
  const cleaned = hex.replace('#', '')
  const full = cleaned.length === 3 ? cleaned.split('').map((c) => c + c).join('') : cleaned
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function Hero() {
  const n = PRODUCTS.length
  const step = 360 / n

  const [rotation, setRotation] = useState(0) // degrees
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef<{ startX: number; startRotation: number } | null>(null)

  const normalizedRotation = useMemo(() => mod(rotation, 360), [rotation])
  const activeIndex = useMemo(() => {
    // Active item when its angle is closest to the top (0deg).
    // Item i angle = i*step + rotation
    // So: i*step + rotation ~= 0  => i ~= -rotation/step
    return mod(Math.round(-normalizedRotation / step), n)
  }, [normalizedRotation, n, step])

  const activeProduct = PRODUCTS[activeIndex]

  // Background tint fade when switching products.
  const [tintVisible, setTintVisible] = useState(true)
  const [tintColor, setTintColor] = useState(activeProduct.themeColor)

  useEffect(() => {
    setTintVisible(false)
    const t = window.setTimeout(() => {
      setTintColor(activeProduct.themeColor)
      setTintVisible(true)
    }, 140)
    return () => window.clearTimeout(t)
  }, [activeProduct.themeColor])

  useEffect(() => {
    // Auto-rotate every few seconds (pause while dragging).
    if (isDragging) return

    const id = window.setInterval(() => {
      setRotation((r) => r - step)
    }, 3500)
    return () => window.clearInterval(id)
  }, [isDragging, step])

  const onPointerDown = (e: React.PointerEvent) => {
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
    dragState.current = { startX: e.clientX, startRotation: rotation }
    setIsDragging(true)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragState.current) return
    const dx = e.clientX - dragState.current.startX
    // Tweak sensitivity to feel like a camera mode wheel.
    setRotation(dragState.current.startRotation + dx * 0.22)
  }

  const onPointerUp = () => {
    dragState.current = null
    setIsDragging(false)
  }

  const radius = 170
  const orbitalItems = useMemo(() => {
    return PRODUCTS.map((p, i) => {
      const theta = i * step + rotation
      const isActive = i === activeIndex
      return { p, i, theta, isActive }
    })
  }, [activeIndex, rotation, step])

  const heroBg = useMemo(() => {
    const tint = hexToRgba(tintColor, 0.16)
    const tint2 = hexToRgba(tintColor, 0.08)
    return `radial-gradient(900px circle at 15% 25%, ${tint} 0%, transparent 60%),
            radial-gradient(700px circle at 90% 70%, ${tint2} 0%, transparent 55%)`
  }, [tintColor])

  return (
    <section
      className="relative bg-background py-24 md:py-40 overflow-hidden"
      style={{
        transition: 'background 500ms ease',
      }}
    >
      {/* Dynamic, subtle product tint */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 transition-opacity duration-500 ease-in-out"
          style={{
            opacity: tintVisible ? 1 : 0,
            backgroundImage: heroBg,
          }}
        />

        {/* Keep a minimal neutral glow for depth */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 animate-pulse" style={{ color: tintColor }} />
                <p
                  className="text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full"
                  style={{
                    color: tintColor,
                    backgroundColor: hexToRgba(tintColor, 0.08),
                    transition: 'background-color 300ms ease, color 300ms ease',
                  }}
                >
                  Premium {activeProduct.category} Collection
                </p>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-balance leading-[1.05] tracking-tight">
                Elevate Your <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">Everyday</span> Space
              </h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-md leading-relaxed">
                Explore handcrafted, premium {activeProduct.category.toLowerCase()} accessories that balance exceptional quality with state-of-the-art aesthetics.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/shop/products/${activeProduct.id}`}>
                <span
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl px-6 py-4 text-base font-semibold text-white shadow-xl hover:-translate-y-0.5 hover:opacity-95 transition-all duration-300 cursor-pointer"
                  style={{
                    backgroundColor: tintColor,
                    boxShadow: `0 12px 30px ${hexToRgba(tintColor, 0.3)}`,
                  }}
                >
                  Explore Details
                  <ArrowRight className="w-5 h-5 animate-pulse" />
                </span>
              </Link>
              <Link href="/shop/products">
                <span
                  className="inline-flex items-center justify-center w-full sm:w-auto rounded-xl px-6 py-4 text-base font-semibold border border-border/80 transition-all duration-300 hover:bg-muted/40 cursor-pointer text-foreground"
                >
                  View Full Shop
                </span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: hexToRgba(tintColor, 0.10) }}
                >
                  <span className="text-sm font-bold" style={{ color: tintColor }}>
                    ✓
                  </span>
                </div>
                <span className="text-sm font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: hexToRgba(tintColor, 0.10) }}
                >
                  <span className="text-sm font-bold" style={{ color: tintColor }}>
                    ✓
                  </span>
                </div>
                <span className="text-sm font-medium">Easy Returns</span>
              </div>
            </div>
          </div>

          {/* Right Hero Draggable Circular Selector */}
          <div className="relative flex items-center justify-center">
            <div className="group relative rounded-3xl overflow-hidden glass-panel shadow-2xl p-6">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-40 pointer-events-none" />

              <div className="relative lg:w-[540px] lg:h-[540px] w-full aspect-square flex items-center justify-center">
                <div
                  className="relative w-full h-full"
                  role="application"
                  aria-label="Product selector"
                >
                  {/* Orbital track */}
                  <div
                    className="absolute inset-0 rounded-full cursor-grab active:cursor-grabbing"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    onWheel={(e) => {
                      setRotation((r) => r + e.deltaY * 0.08)
                    }}
                    tabIndex={0}
                    aria-roledescription="Draggable circular product wheel"
                  >
                    {orbitalItems.map(({ p, i, theta, isActive }) => (
                      <button
                        key={p.id}
                        type="button"
                        aria-label={`Select ${p.name}`}
                        onClick={() => {
                          setRotation(-i * step)
                        }}
                        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${theta}deg) translateY(-${radius}px) rotate(${-theta}deg)`,
                          pointerEvents: 'auto',
                        }}
                      >
                        <div
                          className={`relative flex items-center justify-center rounded-2xl overflow-hidden shadow-xl border transition-all duration-300 ${
                            isActive
                              ? 'scale-115 border-white/80 ring-4 ring-offset-2 ring-offset-background'
                              : 'scale-90 border-white/20 opacity-70 hover:opacity-100 hover:scale-100'
                          }`}
                          style={{
                            width: isActive ? 88 : 68,
                            height: isActive ? 88 : 68,
                            borderColor: p.themeColor,
                            '--tw-ring-color': p.themeColor,
                          } as React.CSSProperties}
                        >
                          <Image
                            src={p.image}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Center product highlight - Clickable link to product */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto">
                    <Link href={`/shop/products/${activeProduct.id}`}>
                      <div
                        className="w-56 h-56 rounded-full flex flex-col items-center justify-center shadow-2xl border glass-panel transition-all duration-500 hover:scale-105 cursor-pointer"
                        style={{
                          borderColor: hexToRgba(activeProduct.themeColor, 0.45),
                          boxShadow: `0 25px 60px -12px ${hexToRgba(activeProduct.themeColor, 0.3)}`,
                        }}
                      >
                        <div className="relative w-28 h-28 rounded-full overflow-hidden border border-white/20 shadow-lg animate-float">
                          <Image
                            src={activeProduct.image}
                            alt={activeProduct.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="mt-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                          {activeProduct.category}
                        </div>
                        <h3 className="text-sm font-bold text-foreground mt-0.5 text-center px-4 truncate max-w-full">
                          {activeProduct.name}
                        </h3>
                        <div className="text-xs font-semibold text-primary mt-1 flex items-center gap-1 font-mono" style={{ color: activeProduct.themeColor }}>
                          <span>${activeProduct.price}</span>
                          <span>•</span>
                          <span className="text-[10px] text-muted-foreground font-normal">View Product</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* A11y / hint row */}
              <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2 px-6 pointer-events-none">
                {PRODUCTS.map((p, i) => (
                  <span
                    key={p.id}
                    className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: p.themeColor,
                      opacity: i === activeIndex ? 1 : 0.35,
                      transform: i === activeIndex ? 'scale(1.3)' : 'scale(1)',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
