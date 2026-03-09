"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { ShieldCheck, LineChart, Lock, Wallet } from "lucide-react";

const benefits = [
  { icon: ShieldCheck, title: "Verified Returns", description: "Transparent rental yields and capital appreciation backed by legal documentation" },
  { icon: LineChart, title: "Professional Management", description: "Expert team handles all property management and tenant relations" },
  { icon: Lock, title: "100% Secure", description: "Legal ownership certificates and complete transparency in all transactions" },
  { icon: Wallet, title: "Dual Income Streams", description: "Earn through monthly rental yields and long-term capital appreciation" },
];

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading title="Why Invest with Destates?" subtitle="We make real estate investment simple, transparent, and rewarding" />
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, i) => (
            <AnimatedSection key={b.title} delay={i * 0.1}>
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg transition-all duration-300 card-glow group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  <b.icon size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-bold text-card-foreground mb-2">{b.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{b.description}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
