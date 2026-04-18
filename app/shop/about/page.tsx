import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Check, Award, Users, Globe } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Agile Shop</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your trusted destination for premium products and exceptional customer service
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-primary text-primary-foreground rounded-lg p-8 md:p-12 mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg opacity-90 max-w-3xl">
            At Agile Shop, we believe in delivering exceptional value to our customers through a curated
            selection of premium products, competitive pricing, and outstanding customer service. We&apos;re
            committed to making quality shopping accessible to everyone.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
            <p className="text-muted-foreground">Carefully selected products that meet our high standards</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Expert Support</h3>
            <p className="text-muted-foreground">Dedicated team ready to help with any questions</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Fast Shipping</h3>
            <p className="text-muted-foreground">Reliable delivery to your doorstep</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Money-Back Guarantee</h3>
            <p className="text-muted-foreground">30-day satisfaction guarantee on all purchases</p>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose Agile Shop?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: 'Competitive Pricing',
                description:
                  'We offer the best prices without compromising on quality. Price match guarantee available.',
              },
              {
                title: 'Secure Checkout',
                description: 'Your data is protected with industry-leading encryption and security protocols.',
              },
              {
                title: 'Easy Returns',
                description: 'Hassle-free returns within 30 days of purchase with full refunds.',
              },
              {
                title: '24/7 Customer Service',
                description: 'Our support team is available around the clock to assist you.',
              },
              {
                title: 'Exclusive Deals',
                description: 'Subscribe to our newsletter for exclusive discounts and early access to sales.',
              },
              {
                title: 'Loyalty Program',
                description: 'Earn points on every purchase and redeem them for rewards.',
              },
            ].map((item, idx) => (
              <div key={idx} className="p-6 border border-border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse our collection of premium products and find exactly what you&apos;re looking for
          </p>
          <Link href="/shop/products">
            <Button size="lg">Start Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
