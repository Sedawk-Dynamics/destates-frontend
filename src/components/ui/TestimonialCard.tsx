"use client";

import { Testimonial } from "@/types";
import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-card rounded-xl p-6 border border-border shadow-sm card-glow"
    >
      <Quote size={24} className="text-primary/30 mb-3" />
      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
        &ldquo;{testimonial.content}&rdquo;
      </p>
      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star key={i} size={14} className="fill-primary text-primary" />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-sm">
          {testimonial.name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div>
          <p className="font-semibold text-card-foreground text-sm">{testimonial.name}</p>
          <p className="text-xs text-muted-foreground">{testimonial.designation}, {testimonial.company}</p>
        </div>
      </div>
    </motion.div>
  );
}
