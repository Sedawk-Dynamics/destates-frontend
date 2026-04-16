"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Rocket, Users, TrendingUp, Building2, Globe, Award } from "lucide-react";

const timeline = [
  {
    year: "2019",
    title: "Company Founded",
    description: "Destates was established with a vision to democratize real estate investment in India.",
    icon: Rocket,
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80",
  },
  {
    year: "2020",
    title: "500+ Investors",
    description: "Crossed our first milestone of active investors on the platform.",
    icon: Users,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
  },
  {
    year: "2021",
    title: "₹100 Cr AUM",
    description: "Assets under management crossed the ₹100 crore mark.",
    icon: TrendingUp,
    image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&q=80",
  },
  {
    year: "2022",
    title: "₹500 Cr AUM",
    description: "Rapid growth with 5x increase in assets under management.",
    icon: Building2,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
  },
  {
    year: "2023",
    title: "50,000+ Investors",
    description: "Built a thriving community of active real estate investors.",
    icon: Globe,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  },
  {
    year: "2024",
    title: "₹5000+ Cr AUM",
    description: "Became one of India's leading fractional ownership platforms.",
    icon: Award,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
  },
];

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
            Our journey
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Milestones that shaped us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From a bold idea in 2019 to India&apos;s leading fractional ownership platform — here&apos;s how the journey has unfolded.
          </p>
        </motion.div>

        <div ref={containerRef} className="relative">
          {/* Static line (background) */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-0.5 bg-border" />

          {/* Animated progress line */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-0 w-0.5 bg-gradient-to-b from-primary to-secondary origin-top"
          />

          <div className="space-y-12 md:space-y-20">
            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative grid grid-cols-[auto_1fr] md:grid-cols-2 gap-6 md:gap-12 items-center ${
                    isLeft ? "" : "md:[&>*:first-child]:order-2"
                  }`}
                >
                  {/* Content side */}
                  <div className={`pl-16 md:pl-0 ${isLeft ? "md:text-right md:pr-12" : "md:pl-12"}`}>
                    <motion.div
                      initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold mb-3"
                    >
                      <Icon size={14} /> {item.year}
                    </motion.div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>

                  {/* Image side (hidden on mobile, shown for both alternating on desktop) */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="hidden md:block"
                  >
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 group">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </motion.div>

                  {/* Timeline dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4, type: "spring" }}
                    className="absolute left-6 md:left-1/2 top-6 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 w-5 h-5 rounded-full bg-primary ring-4 ring-background shadow-lg z-10"
                  >
                    <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-40" />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
