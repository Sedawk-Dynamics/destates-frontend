"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { Home, ShoppingCart, ShieldCheck, TrendingUp, FileCheck, Users } from "lucide-react";

const steps = [
  { icon: Home, title: "Browse Properties", description: "Explore our curated selection of RERA-registered investment properties" },
  { icon: ShoppingCart, title: "Add to Cart", description: "Select your preferred properties and add them to your investment cart" },
  { icon: ShieldCheck, title: "RERA Registered", description: "All properties are government-registered with full legal compliance and transparency" },
  { icon: FileCheck, title: "Verified Properties", description: "Thoroughly vetted properties with complete documentation and market validation" },
  { icon: TrendingUp, title: "Guaranteed Returns", description: "Consistent rental yields and capital appreciation backed by market data" },
  { icon: Users, title: "Dedicated Support", description: "Expert team available to guide you through every step of your investment journey" },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading title="How It Works" subtitle="Four simple steps to start your real estate investment journey" />
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <AnimatedSection key={step.title} delay={i * 0.08}>
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 card-glow group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  <step.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
