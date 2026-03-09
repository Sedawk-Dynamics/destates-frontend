import { PGListing } from "@/types";
import PGCard from "@/components/ui/PGCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

async function getPGs() {
  const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  try {
    const res = await fetch(`${API}/pgs`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data as PGListing[];
  } catch {
    return [];
  }
}

export const metadata = { title: "PG Accommodations | Destates", description: "Find comfortable PG accommodation" };

export default async function PGsPage() {
  const pgs = await getPGs();

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <AnimatedSection>
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">PG Accommodations</h1>
            <p className="text-muted-foreground text-lg max-w-2xl">Find comfortable and affordable accommodation near you.</p>
          </div>
        </AnimatedSection>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pgs.map((pg, i) => (
            <AnimatedSection key={pg.id} delay={i * 0.08}>
              <PGCard pg={pg} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </div>
  );
}
