"use client";

import { PGListing } from "@/types";
import { formatPrice, resolveImageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, BedDouble } from "lucide-react";
import Badge from "./Badge";

export default function PGCard({ pg }: { pg: PGListing }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="card-glow"
    >
      <Link href={`/pgs/${pg.id}`} className="block">
        <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
          <div className="relative h-48 img-zoom">
            {pg.images?.[0] ? (
              <Image
                src={resolveImageUrl(pg.images[0])}
                alt={pg.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">No Image</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute top-3 right-3">
              <Badge variant={pg.available ? "success" : "warning"}>
                {pg.available ? "Available" : "Occupied"}
              </Badge>
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold text-card-foreground mb-1">{pg.name}</h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mb-2">
              <MapPin size={14} /> {pg.location}, {pg.city}
            </p>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xl font-bold text-primary">{formatPrice(pg.monthlyRent)}<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <BedDouble size={14} /> {pg.roomType}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {pg.amenities.slice(0, 4).map((a) => (
                <Badge key={a} variant="muted">{a}</Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone size={14} /> {pg.contactPhone}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
