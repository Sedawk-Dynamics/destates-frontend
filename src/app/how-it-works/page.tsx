import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { Search, CreditCard, FileCheck, Wallet, RefreshCw, ArrowRight, ChevronDown } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "How It Works | Destates", description: "Learn how fractional real estate investment works" };

const steps = [
  { icon: Search, title: "Browse & Select", description: "Explore our curated selection of RERA-registered premium properties. Each listing includes detailed information about location, expected ROI, rental yields, and property highlights.", num: "01" },
  { icon: CreditCard, title: "Invest Securely", description: "Choose your investment amount and complete the transaction through our Razorpay-powered secure payment gateway. Start with as little as ₹5,000.", num: "02" },
  { icon: FileCheck, title: "Get Digital Ownership", description: "Receive your fractional ownership documents digitally. All transactions are recorded and transparent with clear ownership rights.", num: "03" },
  { icon: Wallet, title: "Earn Returns", description: "Start earning monthly rental income from your property investment. Rental yields range from 0.8% to 1.2% monthly, paid directly to your account.", num: "04" },
  { icon: RefreshCw, title: "Grow & Exit", description: "Watch your investment grow with 5-8% annual capital appreciation. You can sell your fractional units digitally whenever you choose.", num: "05" },
];

const faqs = [
  { q: "What is fractional ownership?", a: "Fractional ownership allows multiple investors to own a share of a premium property. You invest a fraction of the total cost and earn proportional rental income and capital appreciation." },
  { q: "What is the minimum investment amount?", a: "You can start investing with as little as ₹5,000 on our platform, making premium real estate accessible to everyone." },
  { q: "How do I earn returns?", a: "You earn through two streams: monthly rental yields (0.8-1.2%) from tenants occupying the property, and long-term capital appreciation (5-8% annually) as property values increase." },
  { q: "Are the properties RERA registered?", a: "Yes, all properties listed on Destates are RERA registered and thoroughly vetted for legal compliance, ensuring complete safety for your investment." },
  { q: "Can I sell my fractional ownership?", a: "Yes, our platform facilitates digital buying, selling, and transfer of fractional units, providing liquidity and flexibility for investors." },
  { q: "How secure are my investments?", a: "We use Razorpay for bank-grade payment security, maintain full legal compliance, and provide transparent ownership documents for every investment." },
];

export default function HowItWorksPage() {
  return (
    <div>
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">Start investing in premium real estate in 5 simple steps</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {steps.map((step, i) => (
              <AnimatedSection key={step.num} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
                <div className="flex gap-6 items-start">
                  <div className="shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">{step.num}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon size={22} className="text-primary" />
                      <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Frequently Asked Questions</h2>
          </AnimatedSection>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <details className="bg-card rounded-xl border border-border shadow-sm group">
                  <summary className="flex items-center justify-between p-5 cursor-pointer text-foreground font-medium">
                    {faq.q}
                    <ChevronDown size={18} className="text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="px-5 pb-5 text-muted-foreground text-sm leading-relaxed">{faq.a}</p>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-background mb-4">Ready to Start Investing?</h2>
            <p className="text-background/60 text-lg mb-8 max-w-xl mx-auto">Join thousands of investors building wealth through premium real estate.</p>
            <Button href="/investments" size="lg">
              Browse Properties <ArrowRight size={18} className="ml-2" />
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
