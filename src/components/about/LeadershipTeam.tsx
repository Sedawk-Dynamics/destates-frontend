"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Linkedin, Mail } from "lucide-react";

const team = [
  {
    name: "Nikhil Singh",
    role: "Founder & CEO",
    desc: "10+ years in real estate & finance",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  },
  {
    name: "Priya Verma",
    role: "CTO & Co-founder",
    desc: "Tech leader with fintech expertise",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
  },
  {
    name: "Amit Singh",
    role: "CFO",
    desc: "Chartered Accountant, 15 yrs experience",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Neha Patel",
    role: "Head of Legal",
    desc: "Expert in real estate compliance & RERA",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
  },
];

export default function LeadershipTeam() {
  return (
    <section className="py-20 md:py-28 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-4">
            The people behind destates
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Leadership Team
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A passionate team of experts committed to redefining how India invests in real estate.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/0 to-transparent" />

                {/* Social overlay on hover */}
                <div className="absolute inset-x-0 bottom-0 p-4 flex gap-2 justify-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <button
                    aria-label={`${member.name} LinkedIn`}
                    className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shadow-lg"
                  >
                    <Linkedin size={18} />
                  </button>
                  <button
                    aria-label={`Email ${member.name}`}
                    className="w-10 h-10 rounded-full bg-card text-foreground border border-border flex items-center justify-center hover:bg-muted transition-colors shadow-lg"
                  >
                    <Mail size={18} />
                  </button>
                </div>
              </div>
              <div className="p-5 text-center">
                <h3 className="font-bold text-card-foreground text-lg">{member.name}</h3>
                <p className="text-primary text-sm font-medium mb-1">{member.role}</p>
                <p className="text-muted-foreground text-xs">{member.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
