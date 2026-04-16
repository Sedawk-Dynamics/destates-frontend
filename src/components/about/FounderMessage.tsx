"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

export default function FounderMessage() {
  return (
    <section className="py-20 md:py-28 bg-muted/30 relative overflow-hidden">
      {/* Background decorations */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 blur-3xl"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="bg-card rounded-3xl p-8 md:p-12 lg:p-16 border border-border shadow-xl relative"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -15 }}
            whileInView={{ opacity: 0.15, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute top-6 right-6 md:top-10 md:right-10 text-primary"
          >
            <Quote size={120} strokeWidth={1} />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex-shrink-0"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden shadow-lg ring-4 ring-primary/20">
                <Image
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80"
                  alt="Nikhil Singh, Founder & CEO"
                  fill
                  className="object-cover"
                  sizes="160px"
                />
              </div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="absolute -bottom-3 -right-3 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg"
              >
                CEO
              </motion.div>
            </motion.div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-3">
                  Message from the Founder
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-card-foreground mb-1">
                  Nikhil Singh
                </h3>
                <p className="text-muted-foreground text-sm mb-6">Founder & CEO, Destates</p>
              </motion.div>

              <motion.blockquote
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-muted-foreground text-base md:text-lg leading-relaxed italic border-l-4 border-primary pl-6"
              >
                &ldquo;We started Destates with a simple belief: everyone deserves access to wealth creation through real estate. Our fractional ownership model removes traditional barriers, enabling investors to build portfolios in premium properties with complete transparency and professional management. Your trust is our greatest asset.&rdquo;
              </motion.blockquote>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
