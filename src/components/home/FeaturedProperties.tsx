"use client";

import { Property } from "@/types";
import PropertyCard from "@/components/ui/PropertyCard";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function FeaturedProperties({ properties }: { properties: Property[] }) {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            title="Featured Investment Opportunities"
            subtitle="Handpicked premium residential properties with verified returns and RERA registration"
          />
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {properties.slice(0, 3).map((property, i) => (
            <AnimatedSection key={property.id} delay={i * 0.1}>
              <PropertyCard property={property} />
            </AnimatedSection>
          ))}
        </div>
        <div className="text-center">
          <Button href="/investments" variant="outline">
            View All Properties <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
