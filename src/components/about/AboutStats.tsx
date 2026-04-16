"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Users, IndianRupee, Building2, Award } from "lucide-react";

const stats = [
  { icon: Users, value: 50000, suffix: "+", label: "Active Investors", prefix: "" },
  { icon: IndianRupee, value: 5000, suffix: " Cr+", label: "Assets Under Management", prefix: "₹" },
  { icon: Building2, value: 200, suffix: "+", label: "Premium Properties", prefix: "" },
  { icon: Award, value: 98, suffix: "%", label: "Investor Satisfaction", prefix: "" },
];

function Counter({ target, prefix, suffix }: { target: number; prefix: string; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export default function AboutStats() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary via-primary to-secondary relative overflow-hidden">
      {/* Decorative grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center text-white group"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 mb-3 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                <stat.icon size={26} strokeWidth={1.8} />
              </div>
              <p className="text-3xl md:text-4xl font-bold mb-1">
                <Counter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </p>
              <p className="text-white/80 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
