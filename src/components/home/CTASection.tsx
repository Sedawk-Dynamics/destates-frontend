"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start Your Investment Journey Today
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
            Join thousands of investors building wealth through real estate
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button href="/investments" size="lg" className="bg-white text-primary hover:bg-white/90">
              Browse Properties <ArrowRight size={18} className="ml-2" />
            </Button>
            <Button href="/how-it-works" variant="outline" size="lg" className="border-white text-white hover:bg-white/10 hover:text-white">
              Learn More
            </Button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
