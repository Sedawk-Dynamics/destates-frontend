"use client";

import { Property } from "@/types";
import { formatCurrency, resolveImageUrl } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { MapPin, TrendingUp, Maximize, Building } from "lucide-react";
import Badge from "./Badge";

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="card-glow"
    >
      <Link href={`/investments/${property.id}`} className="block">
        <div className="bg-card rounded-xl overflow-hidden border border-border shadow-sm">
          <div className="relative h-52 img-zoom">
            {property.images?.[0] ? (
              <Image
                src={resolveImageUrl(property.images[0])}
                alt={property.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">No Image</div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute top-3 left-3">
              <Badge variant={property.status === "AVAILABLE" ? "success" : "warning"}>
                {property.status === "AVAILABLE" ? "Available" : "Limited"}
              </Badge>
            </div>
            {property.reraRegistered && (
              <div className="absolute top-3 right-3">
                <Badge variant="primary">RERA Registered</Badge>
              </div>
            )}
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold text-card-foreground mb-1">{property.name}</h3>
            <p className="text-muted-foreground text-sm flex items-center gap-1 mb-3">
              <MapPin size={14} /> {property.location}, {property.city}
            </p>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Total Price</p>
                <p className="text-xl font-bold text-primary">{formatCurrency(property.price)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Expected ROI</p>
                <p className="text-xl font-bold text-green-600 flex items-center gap-1">
                  <TrendingUp size={16} /> {property.expectedROI}% <span className="text-xs font-normal">p.a.</span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-3">
              <span className="flex items-center gap-1"><Maximize size={14} /> {property.area} sq ft</span>
              <span className="flex items-center gap-1"><Building size={14} /> {property.availableUnits} units</span>
              {property.readyToMove && <Badge variant="success">Ready to Move</Badge>}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
