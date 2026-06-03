import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Check, Award, Users, Globe, ShieldCheck, Sparkles, Star } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="relative py-16 bg-background overflow-hidden min-h-screen">
      {/* Background radial effects */}
      <div className="absolute top-1/4 left-[-15%] w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-[-15%] w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '3s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center mb-20 space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Our Story</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
            About <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Agile Shop</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            We are dedicated to curation, outstanding build quality, and delivering an exceptional shopping experience directly to you.
          </p>
        </div>

        {/* Mission Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl p-8 md:p-12 mb-20 bg-gradient-to-br from-primary via-primary to-accent text-primary-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent opacity-75" />
          <div className="relative space-y-4 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Our Mission</h2>
            <p className="text-base md:text-lg opacity-90 leading-relaxed">
              At Agile Shop, we believe in delivering exceptional value to our customers through a curated
              selection of premium products, competitive pricing, and outstanding customer service. We&apos;re
              committed to making quality shopping accessible, sustainable, and enjoyable.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {[
            {
              icon: <Award className="w-6 h-6 text-primary" />,
              title: 'Premium Quality',
              description: 'Carefully selected products that meet our high standards',
            },
            {
              icon: <Users className="w-6 h-6 text-primary" />,
              title: 'Expert Support',
              description: 'Dedicated team ready to help with any questions',
            },
            {
              icon: <Globe className="w-6 h-6 text-primary" />,
              title: 'Fast Shipping',
              description: 'Reliable delivery to your doorstep',
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-primary" />,
              title: 'Money-Back Guarantee',
              description: '30-day satisfaction guarantee on all purchases',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-3xl p-6 text-center hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group border border-border/60"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="font-bold text-base mb-1.5 text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="mb-20">
          <h2 className="text-3xl font-black text-center mb-12 tracking-tight text-foreground">Why Choose Agile Shop?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                title: '24/7 Customer Support',
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
              <div
                key={idx}
                className="glass-panel rounded-3xl p-6 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 border border-border/50 hover:border-primary/30"
              >
                <h3 className="font-bold text-sm mb-2 text-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 text-center border border-border/60 max-w-4xl mx-auto shadow-lg space-y-6">
          <h2 className="text-3xl font-black tracking-tight text-foreground">Ready to Discover More?</h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Browse our curated collections of premium electronics, gadgets, audio and fashion accessories.
          </p>
          <Link href="/shop/products" className="inline-block">
            <Button size="lg" className="rounded-xl px-8 h-12 shadow-lg font-semibold bg-primary hover:bg-primary/95 text-white">
              Start Shopping
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
