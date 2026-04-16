"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Building2, ShieldCheck, TrendingUp } from "lucide-react";

const highlights = [
  { icon: Building2, label: "Premium Properties", value: "200+" },
  { icon: ShieldCheck, label: "RERA Verified", value: "100%" },
  { icon: TrendingUp, label: "Avg. Returns", value: "12-15%" },
];

export default function WhoWeAre() {
  return (
    <section className="py-20 md:py-28 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&q=80"
                alt="Modern Destates workspace"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
            </div>

            {/* Decorative frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -top-6 -left-6 w-32 h-32 border-4 border-primary/30 rounded-3xl -z-10"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-primary to-secondary rounded-3xl -z-10 opacity-20"
            />

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-8 left-6 md:left-10 bg-card rounded-2xl p-5 shadow-xl border border-border"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Building2 size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">5+ Yrs</p>
                  <p className="text-xs text-muted-foreground">of Excellence</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
              Who We Are
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
              Pioneering fractional real estate in India
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Destates is a pioneering real estate investment platform that enables investors to participate in premium properties through a structured fractional ownership model. We believe access to high-quality real estate should not be limited to a select few.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Our platform facilitates the buying, selling, and transfer of fractional units digitally — ensuring transparency, efficiency, and ease of transaction. Investors benefit from dual income streams: periodic rental income and long-term capital appreciation.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {highlights.map((h, i) => (
                <motion.div
                  key={h.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="bg-card border border-border rounded-xl p-4 text-center hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <h.icon size={22} className="text-primary mx-auto mb-2" />
                  <p className="text-lg md:text-xl font-bold text-foreground">{h.value}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight">{h.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
