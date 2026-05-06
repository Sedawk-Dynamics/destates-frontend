import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import FeaturedProperties from "@/components/home/FeaturedProperties";

import BenefitsSection from "@/components/home/BenefitsSection";
import InvestmentReturns from "@/components/home/InvestmentReturns";
import HowItWorks from "@/components/home/HowItWorks";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";
import { Property, Testimonial } from "@/types";
import Image from "next/image";

async function getData() {
  const API = process.env.NEXT_PUBLIC_API_URL || "https://api.destates.in/api";
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

function HomeContent({
  properties,
  testimonials,
}: {
  properties: Property[];
  testimonials: Testimonial[];
}) {
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

export default async function Home() {
  const { properties, testimonials } = await getData();
  // Original home page content is preserved below; rendering Coming Soon for now.
  void HomeContent;
  void properties;
  void testimonials;

  return (
    <section className="relative -mt-16 min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Ambient background */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 15% 10%, rgba(212,168,76,0.18), transparent 60%), radial-gradient(900px 500px at 85% 90%, rgba(212,132,0,0.14), transparent 60%), linear-gradient(180deg, #fefbf8 0%, #fbf3e8 100%)",
        }}
      />

      {/* Subtle grid texture */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 75%)",
        }}
      />

      {/* Floating gold orbs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(circle, #d4a84c 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, #d48400 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-24 text-center">
        {/* Logo */}
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-[0_10px_40px_-12px_rgba(212,168,76,0.5)] ring-1 ring-[var(--border)]">
          <Image
            src="/logo.png"
            alt="Destates"
            width={56}
            height={56}
            priority
            className="h-14 w-14 object-contain"
          />
        </div>

        {/* Eyebrow */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/70 px-4 py-1.5 text-xs font-medium tracking-[0.2em] uppercase text-[var(--muted-foreground)] backdrop-blur">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--primary)]" />
          </span>
          Launching Soon
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          <span className="text-gradient">Coming Soon</span>
        </h1>

        {/* Divider */}
        <div className="mx-auto mb-8 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--primary)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
          <span className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--primary)]" />
        </div>

        {/* Tagline */}
        <p className="mx-auto mb-3 max-w-xl text-lg text-[var(--foreground)]/80 sm:text-xl">
          Something extraordinary is on the way.
        </p>
        <p className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)]">
          We&apos;re crafting a refined experience for premium real estate
          investment — structured fractional ownership in RERA‑registered
          properties, land plots, and PG accommodations. Stay tuned.
        </p>

        {/* CTA */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="mailto:hello@destates.in"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--foreground)] px-7 py-3.5 text-sm font-medium text-[var(--background)] shadow-lg transition-all hover:shadow-[0_12px_40px_-8px_rgba(212,168,76,0.6)] hover:-translate-y-0.5"
          >
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[var(--primary)] via-[#f0c878] to-[var(--secondary)] transition-transform duration-500 group-hover:translate-x-0"
            />
            <span className="relative">Get in touch</span>
            <svg
              className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
          <a
            href="/contact"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white/60 px-7 py-3.5 text-sm font-medium text-[var(--foreground)] backdrop-blur transition-colors hover:bg-white"
          >
            Contact us
          </a>
        </div>

        {/* Footer note */}
        <p className="mt-16 text-xs tracking-[0.18em] uppercase text-[var(--muted-foreground)]">
          Destates — Invest Without Sorrow
        </p>
      </div>
    </section>
  );
}
