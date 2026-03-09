import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import LandPlotsSection from "@/components/home/LandPlotsSection";
import BenefitsSection from "@/components/home/BenefitsSection";
import InvestmentReturns from "@/components/home/InvestmentReturns";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import { Property, LandPlot, Testimonial } from "@/types";

async function getData() {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const [propsRes, plotsRes, testimonialsRes] = await Promise.all([
      fetch(`${API}/properties`, { cache: "no-store" }),
      fetch(`${API}/plots`, { cache: "no-store" }),
      fetch(`${API}/testimonials`, { cache: "no-store" }),
    ]);
    const props = propsRes.ok ? await propsRes.json() : { data: [] };
    const plots = plotsRes.ok ? await plotsRes.json() : { data: [] };
    const testimonials = testimonialsRes.ok ? await testimonialsRes.json() : { data: [] };
    return {
      properties: props.data as Property[],
      plots: plots.data as LandPlot[],
      testimonials: testimonials.data as Testimonial[],
    };
  } catch {
    return { properties: [], plots: [], testimonials: [] };
  }
}

export default async function Home() {
  const { properties, plots, testimonials } = await getData();

  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedProperties properties={properties} />
      <LandPlotsSection plots={plots} />
      <BenefitsSection />
      <InvestmentReturns />
      <HowItWorks />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </>
  );
}
