"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { ArrowRight, Shield, TrendingUp, CheckCircle } from "lucide-react";

const heroImages = [
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
    alt: "Modern Office Building",
  },
  {
    src: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=800&q=80",
    alt: "Shopping Mall Interior",
  },
  {
    src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
    alt: "Premium Commercial Complex",
  },
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroImages.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative min-h-[90vh] flex items-center bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium mb-6"
            >
              <Shield size={16} /> RERA Registered & Verified Properties
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6"
            >
              Affordable Commercial &{" "}
              <span className="text-gradient">Premium Investments</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 max-w-xl"
            >
              Your marketplace for ultra-luxury shops, office spaces, studio apartments, and affordable
              housing. Enjoy hassle-free rental income secured by long-term dry leases of 9 to 15 years
              with top brands including M3M. Invest with confidence on a transparent, RERA-backed platform.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Button href="/investments" size="lg">
                Explore Properties <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button href="/how-it-works" variant="outline" size="lg">
                Learn More
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <TrendingUp size={16} className="text-green-600" />
                <span>12-15% Expected Annual Returns</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-border" />
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <CheckCircle size={16} className="text-primary" />
                <span>100% Secure & Transparent</span>
              </div>
            </motion.div>
          </div>

          {/* Right Image Slider */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl relative h-[450px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -60 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={heroImages[currentIndex].src}
                      alt={heroImages[currentIndex].alt}
                      width={600}
                      height={450}
                      className="w-full h-full object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slide indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-primary w-7"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -bottom-6 -left-6 bg-card rounded-xl p-4 shadow-lg border border-border"
              >
                <p className="text-2xl font-bold text-primary">12-15%</p>
                <p className="text-xs text-muted-foreground">Avg. Annual Returns</p>
              </motion.div>
              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-xl px-4 py-2 shadow-lg text-sm font-semibold"
              >
                RERA Verified
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
