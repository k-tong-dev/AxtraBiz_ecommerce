/* eslint-disable react/no-unknown-property */
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Product = {
  id: string
  name: string
  themeColor: string
  emoji: string
}

const PRODUCTS: Product[] = [
  { id: 'laptop', name: 'Laptop', themeColor: '#6366F1', emoji: '💻' },
  { id: 'speaker', name: 'Speaker', themeColor: '#14B8A6', emoji: '🔊' },
  { id: 'keyboard', name: 'Keyboard', themeColor: '#8B5CF6', emoji: '⌨️' },
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
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="inline-block">
                <p
                  className="text-sm font-semibold px-4 py-2 rounded-full"
                  style={{
                    color: tintColor,
                    backgroundColor: hexToRgba(tintColor, 0.08),
                    transition: 'background-color 300ms ease, color 300ms ease',
                  }}
                >
                  Premium Collection
                </p>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance leading-tight">
                Curated Quality for Modern Living
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
                Experience the finest selection of premium products, handpicked for quality and style. Fast delivery, exceptional service, 30-day guarantee.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop/products">
                <span
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-md px-5 py-4 text-base font-medium text-white shadow-sm transition-[background-color,transform,opacity] duration-300"
                  style={{
                    backgroundColor: tintColor,
                    boxShadow: `0 10px 30px ${hexToRgba(tintColor, 0.25)}`,
                  }}
                >
                  Browse Collection
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
              <Link href="/shop/about">
                <span
                  className="inline-flex items-center justify-center w-full sm:w-auto rounded-md px-5 py-4 text-base font-medium border transition-colors duration-300"
                  style={{
                    borderColor: hexToRgba(tintColor, 0.35),
                    color: '#111827',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                  }}
                >
                  Our Story
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
            <div className="group relative rounded-3xl overflow-hidden bg-surface/75 backdrop-blur-xl border border-border/60">
              {/* Requested shift: left: 0 -> -18px equivalent */}
              <div className="absolute inset-y-0 left-[-18px] right-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0  pointer-events-none" />

              <div className="relative lg:w-[592px] lg:h-[574px] w-full aspect-square flex items-center justify-center p-6">
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
                      // Wheel / scroll to rotate between products.
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
                          // Snap rotation so this item lands at the top.
                          setRotation(-i * step)
                        }}
                        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300"
                        style={{
                          transform: `translate(-50%, -50%) rotate(${theta}deg) translateY(-${radius}px) rotate(${-theta}deg)`,
                          pointerEvents: 'auto',
                        }}
                      >
                        <div
                          className={`flex items-center justify-center rounded-full shadow-lg border transition-all duration-300 ${
                            isActive
                              ? 'scale-110 border-white/60'
                              : 'scale-100 border-white/30 opacity-95'
                          }`}
                          style={{
                            width: isActive ? 92 : 72,
                            height: isActive ? 92 : 72,
                            backgroundColor: hexToRgba(p.themeColor, isActive ? 0.18 : 0.10),
                            borderColor: hexToRgba(p.themeColor, isActive ? 0.55 : 0.35),
                          }}
                        >
                          <span className="text-3xl" aria-hidden="true">
                            {p.emoji}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Center product highlight */}
                  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-xl border"
                      style={{
                        backgroundColor: hexToRgba(activeProduct.themeColor, 0.14),
                        borderColor: hexToRgba(activeProduct.themeColor, 0.45),
                        boxShadow: `0 30px 80px ${hexToRgba(activeProduct.themeColor, 0.18)}`,
                        transition: 'background-color 300ms ease, border-color 300ms ease',
                      }}
                    >
                      <div
                        className="text-5xl"
                        style={{
                          filter: `drop-shadow(0 10px 30px ${hexToRgba(activeProduct.themeColor, 0.25)})`,
                        }}
                      >
                        {activeProduct.emoji}
                      </div>
                      <div className="mt-4 text-lg font-semibold text-foreground" style={{ color: '#111827' }}>
                        {activeProduct.name}
                      </div>
                      <div className="mt-1 text-sm text-foreground/60">
                        Drag to explore
                      </div>

                      {/* Small indicator */}
                      <div
                        className="mt-5 w-20 h-1.5 rounded-full"
                        style={{ backgroundColor: hexToRgba(activeProduct.themeColor, 0.65) }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* A11y / hint row */}
              <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-2 px-6 pointer-events-none">
                {PRODUCTS.map((p, i) => (
                  <span
                    key={p.id}
                    className="h-2 w-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: p.themeColor,
                      opacity: i === activeIndex ? 1 : 0.35,
                      transform: i === activeIndex ? 'scale(1.2)' : 'scale(1)',
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
