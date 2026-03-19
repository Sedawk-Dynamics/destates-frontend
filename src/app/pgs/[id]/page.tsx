"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, BedDouble, CheckCircle, Wifi, Wind, Droplets, Zap } from "lucide-react";
import { PGListing } from "@/types";
import { getPGById } from "@/lib/api";
import { formatPrice, resolveImageUrl } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export default function PGDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [pg, setPg] = useState<PGListing | null>(null);

  useEffect(() => {
    getPGById(id).then((res) => setPg(res.data)).catch(() => {});
  }, [id]);

  if (!pg) return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Loading...</div>;

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/pgs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={16} /> Back to PG Listings
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-3">
            {pg.images.map((img, i) => (
              <div key={i} className="relative h-64 rounded-xl overflow-hidden">
                <Image src={resolveImageUrl(img)} alt={pg.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              </div>
            ))}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={pg.available ? "success" : "warning"}>{pg.available ? "Available" : "Full"}</Badge>
              <Badge variant="muted">{pg.roomType} Sharing</Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{pg.name}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mb-4"><MapPin size={16} /> {pg.location}, {pg.city}</p>
            <p className="text-3xl font-bold text-primary mb-6">{formatPrice(pg.monthlyRent)}<span className="text-base font-normal text-muted-foreground">/month</span></p>

            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{pg.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3">Amenities</h3>
              <div className="grid grid-cols-2 gap-3">
                {pg.amenities.map((a) => (
                  <span key={a} className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2.5 rounded-xl">
                    <CheckCircle size={16} className="text-green-500 shrink-0" /> {a}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-muted/50 rounded-xl p-6">
              <h3 className="font-semibold text-foreground mb-3">Contact</h3>
              <a href={`tel:${pg.contactPhone}`} className="flex items-center gap-2 text-primary font-semibold text-lg hover:underline">
                <Phone size={20} /> {pg.contactPhone}
              </a>
              <p className="text-sm text-muted-foreground mt-2">Call us to schedule a visit or book your room today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
