import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductCard } from './product-card'
import { mockProducts } from '@/lib/mock-data'
import { ArrowRight } from 'lucide-react'

export function FeaturedProducts() {
  const featured = mockProducts.slice(0, 6)

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background via-background to-secondary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between mb-16 gap-8">
          <div className="space-y-3">
            <div className="inline-block">
              <p className="text-sm font-semibold text-primary bg-primary/10 px-4 py-2 rounded-full">Curated Selection</p>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">Featured Products</h2>
            <p className="text-lg text-muted-foreground max-w-xl">Discover our handpicked collection of premium items designed for discerning customers</p>
          </div>
          <Link href="/shop/products" className="hidden md:block">
            <Button className="gap-2 shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="flex justify-center mt-8 md:hidden">
          <Link href="/shop/products">
            <Button className="gap-2">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
