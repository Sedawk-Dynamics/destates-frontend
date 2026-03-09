"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";

const metrics = [
  { icon: TrendingUp, value: "12-15%", label: "Average Annual Return", sublabel: "Consistent performance across all properties" },
  { icon: Calendar, value: "0.8-1.2%", label: "Monthly Rental Yield", sublabel: "Regular passive income stream" },
  { icon: BarChart3, value: "5-8%", label: "Capital Appreciation", sublabel: "Year-over-year growth in property value" },
];

export default function InvestmentReturns() {
  return (
    <section className="py-20 bg-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">Investment Returns</h2>
            <p className="text-background/60 text-lg max-w-2xl mx-auto">Track record of delivering consistent returns to our investors</p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((m, i) => (
            <AnimatedSection key={m.label} delay={i * 0.15}>
              <div className="bg-background/5 border border-background/10 rounded-xl p-8 text-center backdrop-blur-sm hover:bg-background/10 transition-colors">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/20 text-primary mb-4">
                  <m.icon size={28} strokeWidth={1.5} />
                </div>
                <p className="text-4xl font-bold text-primary mb-2">{m.value}</p>
                <p className="text-background font-semibold mb-1">{m.label}</p>
                <p className="text-background/50 text-sm">{m.sublabel}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
