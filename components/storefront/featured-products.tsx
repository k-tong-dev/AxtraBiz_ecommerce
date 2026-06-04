import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductCard } from './product-card'
import { mockProducts } from '@/lib/mock-data'
import { ArrowRight, Sparkles } from 'lucide-react'

export function FeaturedProducts() {
  const featured = mockProducts.slice(0, 6)

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-background">
      {/* Background blobs for visual depth */}
      <div className="absolute top-1/4 right-[-10%] w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-30 animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-[-10%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Curated Selection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
              Featured <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Products</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl leading-relaxed">
              Discover our handpicked collection of premium items, designed to enhance your modern lifestyle with style and quality.
            </p>
          </div>
          <Link href="/website/products" className="hidden md:block">
            <Button className="rounded-xl gap-2 shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 font-semibold px-5 py-5 h-11 bg-primary hover:bg-primary/95 text-white">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {featured.map((product, index) => (
            <div
              key={product.id}
              className="opacity-0 translate-y-4 animate-fade-in"
              style={{
                animationPlayState: 'running',
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'forwards',
                animationDuration: '0.6s',
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="flex justify-center mt-12 md:hidden">
          <Link href="/website/products">
            <Button className="rounded-xl gap-2 font-semibold px-6 py-5 h-11">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
