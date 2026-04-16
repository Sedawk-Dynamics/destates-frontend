"use client";

import { motion } from "framer-motion";
import { Target, Lightbulb, Heart } from "lucide-react";

const items = [
  {
    icon: Target,
    title: "Our Mission",
    text: "To democratize real estate investment through fractional ownership, making premium properties accessible to every investor.",
    gradient: "from-blue-500/10 to-primary/10",
    iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    icon: Lightbulb,
    title: "Our Vision",
    text: "To become the most trusted platform in India for building financial freedom through verified, professionally managed real estate.",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: Heart,
    title: "Core Values",
    text: "Transparency, Integrity, Innovation, Customer-First, Excellence, and Sustainability guide every decision we make.",
    gradient: "from-rose-500/10 to-pink-500/10",
    iconBg: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
];

export default function MissionVisionValues() {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
            What drives us
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
            Mission, Vision & Values
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ y: -8 }}
              className="group relative bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative">
                <motion.div
                  whileHover={{ rotate: -5, scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${item.iconBg} mb-5`}
                >
                  <item.icon size={30} strokeWidth={1.8} />
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold text-card-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{item.text}</p>
              </div>

              {/* Decorative corner */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
