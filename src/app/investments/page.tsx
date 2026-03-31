import { Property } from "@/types";
import PropertyCard from "@/components/ui/PropertyCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

async function getProperties() {
  const API = process.env.NEXT_PUBLIC_API_URL || "https://api.destates.in/api";
  try {
    const res = await fetch(`${API}/properties`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data as Property[];
  } catch {
    return [];
  }
}

export const metadata = {
  title: "Investment Properties | Destates",
  description: "Browse premium RERA-registered investment properties with verified returns",
};

export default async function InvestmentsPage() {
  const properties = await getProperties();

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <AnimatedSection>
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Investment Opportunities</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover handpicked premium residential properties with verified returns and RERA registration.
            </p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property, i) => (
            <AnimatedSection key={property.id} delay={i * 0.08}>
              <PropertyCard property={property} />
            </AnimatedSection>
          ))}
        </div>
        {properties.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-lg">No properties available at the moment.</p>
            <p className="text-sm mt-2">Please check back later or contact us for more information.</p>
          </div>
        )}
      </div>
    </div>
  );
}
