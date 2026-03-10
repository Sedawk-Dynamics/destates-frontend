import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";

import BenefitsSection from "@/components/home/BenefitsSection";
import InvestmentReturns from "@/components/home/InvestmentReturns";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import { Property, Testimonial } from "@/types";

async function getData() {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const [propsRes, testimonialsRes] = await Promise.all([
      fetch(`${API}/properties`, { cache: "no-store" }),
      fetch(`${API}/testimonials`, { cache: "no-store" }),
    ]);
    const props = propsRes.ok ? await propsRes.json() : { data: [] };
    const testimonials = testimonialsRes.ok ? await testimonialsRes.json() : { data: [] };
    return {
      properties: props.data as Property[],
      testimonials: testimonials.data as Testimonial[],
    };
  } catch {
    return { properties: [], testimonials: [] };
  }
}

export default async function Home() {
  const { properties, testimonials } = await getData();

  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedProperties properties={properties} />

      <BenefitsSection />
      <InvestmentReturns />
      <HowItWorks />
      <TestimonialsSection testimonials={testimonials} />
      <CTASection />
    </>
  );
}
