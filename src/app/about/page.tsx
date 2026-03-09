import AnimatedSection from "@/components/ui/AnimatedSection";
import { Target, Lightbulb, Heart, Users, TrendingUp, Award, Building, Globe } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us | Destates", description: "Learn about Destates and our mission" };

const timeline = [
  { year: "2019", title: "Company Founded", description: "Destates was established with a vision to democratize real estate" },
  { year: "2020", title: "500+ Investors", description: "Crossed our first milestone of active investors on the platform" },
  { year: "2021", title: "₹100 Cr AUM", description: "Assets under management crossed the ₹100 crore mark" },
  { year: "2022", title: "₹500 Cr AUM", description: "Rapid growth with 5x increase in assets under management" },
  { year: "2023", title: "50,000+ Investors", description: "Built a thriving community of active real estate investors" },
  { year: "2024", title: "₹5000+ Cr AUM", description: "Became one of India's leading fractional ownership platforms" },
];

const team = [
  { name: "Nikhil Singh", role: "Founder & CEO", desc: "10+ years in real estate & finance" },
  { name: "Priya Verma", role: "CTO & Co-founder", desc: "Tech leader with fintech expertise" },
  { name: "Amit Singh", role: "CFO", desc: "Chartered Accountant with 15 years experience" },
  { name: "Neha Patel", role: "Head of Legal", desc: "Expert in real estate compliance & RERA" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-20 bg-gradient-to-br from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Destates</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Revolutionizing real estate investing through transparency, technology, and fractional ownership.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-foreground mb-6">Who We Are</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Destates is a pioneering real estate investment platform that enables investors to participate in premium properties through a structured fractional ownership model. We believe that access to high-quality real estate should not be limited to a select few.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our platform facilitates the buying, selling, and transfer of fractional units digitally, ensuring transparency, efficiency, and ease of transaction. Investors benefit from dual income streams: periodic rental income and long-term capital appreciation.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Founder Message */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">NS</div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground">Nikhil Singh</h3>
                  <p className="text-muted-foreground text-sm">Founder & CEO</p>
                </div>
              </div>
              <blockquote className="text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-6">
                &ldquo;We started Destates with a simple belief: everyone deserves access to wealth creation through real estate. Our fractional ownership model removes traditional barriers, enabling investors to build portfolios in premium properties with complete transparency and professional management. Your trust is our greatest asset.&rdquo;
              </blockquote>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Target, title: "Our Mission", text: "To democratize real estate investment through fractional ownership, making premium properties accessible to every investor." },
              { icon: Lightbulb, title: "Our Vision", text: "To become the most trusted platform in India for building financial freedom through verified, professionally managed real estate." },
              { icon: Heart, title: "Core Values", text: "Transparency, Integrity, Innovation, Customer-First, Excellence, and Sustainability guide every decision we make." },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <div className="bg-card rounded-xl p-8 border border-border shadow-sm text-center h-full">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
                    <item.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-card-foreground mb-3">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Journey</h2>
          </AnimatedSection>
          <div className="space-y-8">
            {timeline.map((item, i) => (
              <AnimatedSection key={item.year} delay={i * 0.08}>
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">{item.year}</div>
                    {i < timeline.length - 1 && <div className="w-px h-full bg-border mt-2" />}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Leadership Team</h2>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 0.1}>
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <h3 className="font-bold text-card-foreground">{member.name}</h3>
                  <p className="text-primary text-sm font-medium">{member.role}</p>
                  <p className="text-muted-foreground text-xs mt-1">{member.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Office */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <Globe size={48} className="text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Our Office</h2>
            <p className="text-muted-foreground">DLF Phase 5, Two Horizone, Centre-2, Golf Course Road, DLF QE, Gurgaon, Haryana, India, 122002</p>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
