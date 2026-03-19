"use client";

import { LandPlot } from "@/types";
import { formatPrice, resolveImageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Ruler } from "lucide-react";
import Badge from "./Badge";

export default function PlotCard({ plot }: { plot: LandPlot }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="card-glow"
    >
      <Link href={`/plots/${plot.id}`} className="block">
        <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
          <div className="relative h-48 img-zoom">
            {plot.images?.[0] ? (
              <Image
                src={resolveImageUrl(plot.images[0])}
                alt={plot.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">No Image</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold text-card-foreground mb-1">{plot.name}</h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mb-3">
              <MapPin size={14} /> {plot.location}, {plot.city}
            </p>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Ruler size={14} /> {plot.totalArea} sq ft
              </div>
              <p className="text-lg font-bold text-primary">{formatPrice(plot.pricePerSqft)}/sq ft</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {plot.amenities.slice(0, 3).map((a) => (
                <Badge key={a} variant="muted">{a}</Badge>
              ))}
            </div>
            <div className="bg-primary text-primary-foreground text-center py-2.5 rounded-[var(--radius)] font-semibold text-sm hover:opacity-90 transition-opacity">
              View & Select Area
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
