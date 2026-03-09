"use client";

import { LandPlot } from "@/types";
import PlotCard from "@/components/ui/PlotCard";
import SectionHeading from "@/components/ui/SectionHeading";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function LandPlotsSection({ plots }: { plots: LandPlot[] }) {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <SectionHeading
            title="Available Land Plots"
            subtitle="Select from our premium land plots and choose your exact area"
          />
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {plots.slice(0, 3).map((plot, i) => (
            <AnimatedSection key={plot.id} delay={i * 0.1}>
              <PlotCard plot={plot} />
            </AnimatedSection>
          ))}
        </div>
        <div className="text-center">
          <Button href="/plots" variant="outline">
            Browse All Plots <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}
