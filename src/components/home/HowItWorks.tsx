"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { Home, ShoppingCart, ShieldCheck, TrendingUp, FileCheck, Users, ArrowLeftRight } from "lucide-react";

const steps = [
  { icon: Home, title: "Browse Marketplace", description: "Explore affordable housing, ultra-luxury shops, offices, and studio apartments from top developers like M3M" },
  { icon: ShoppingCart, title: "Select & Invest", description: "Choose your preferred property and add it to your cart — we handle all agreements and documentation" },
  { icon: ShieldCheck, title: "Secured by Leases", description: "Properties come with long-term dry leases of 9 to 15 years with leading brands, ensuring guaranteed rental income" },
  { icon: ArrowLeftRight, title: "Easy Property Transfer", description: "We manage the complete transfer process — agreements, company approvals, and documentation between buyer and seller" },
  { icon: TrendingUp, title: "Hassle-Free Income", description: "Sit back and earn consistent rental income while our team manages everything end-to-end" },
  { icon: Users, title: "Dedicated Support", description: "Expert team available to guide you through every step — from investment to property transfer and beyond" },
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
