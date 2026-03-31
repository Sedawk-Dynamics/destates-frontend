import { LandPlot } from "@/types";
import PlotCard from "@/components/ui/PlotCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

async function getPlots() {
  const API = process.env.NEXT_PUBLIC_API_URL || "https://api.destates.in/api";
  try {
    const res = await fetch(`${API}/plots`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data as LandPlot[];
  } catch {
    return [];
  }
}

export const metadata = { title: "Land Plots | Destates", description: "Browse premium land plots" };

export default async function PlotsPage() {
  const plots = await getPlots();

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <AnimatedSection>
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Available Land Plots</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">Select from our premium land plots and choose your exact area</p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plots.map((plot, i) => (
            <AnimatedSection key={plot.id} delay={i * 0.08}>
              <PlotCard plot={plot} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
