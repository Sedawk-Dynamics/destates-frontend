"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Ruler, CheckCircle, ShoppingCart } from "lucide-react";
import { LandPlot } from "@/types";
import { getPlotById } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function PlotDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [plot, setPlot] = useState<LandPlot | null>(null);
  const [selectedArea, setSelectedArea] = useState(0);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    getPlotById(id).then((res) => {
      setPlot(res.data);
      setSelectedArea(res.data.minArea);
    }).catch(() => {});
  }, [id]);

  if (!plot) return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Loading...</div>;

  const totalPrice = selectedArea * plot.pricePerSqft;

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error("Please login to add items to cart"); return; }
    try {
      await addItem({ itemType: "PLOT", itemId: plot.id, selectedArea });
      toast.success("Plot added to cart!");
    } catch { toast.error("Failed to add to cart"); }
  };

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/plots" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={16} /> Back to Plots
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="relative h-80 md:h-[400px] rounded-xl overflow-hidden">
            <Image src={plot.images[0]} alt={plot.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{plot.name}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mb-6"><MapPin size={16} /> {plot.location}, {plot.city}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Area</p>
                <p className="text-lg font-bold text-foreground flex items-center justify-center gap-1"><Ruler size={16} /> {plot.totalArea} sqft</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Price per sqft</p>
                <p className="text-lg font-bold text-primary">{formatPrice(plot.pricePerSqft)}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{plot.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {plot.amenities.map((a) => (
                  <span key={a} className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full">
                    <CheckCircle size={14} className="text-green-500" /> {a}
                  </span>
                ))}
              </div>
            </div>

            {/* Area Calculator */}
            <div className="bg-muted/50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-3">Select Your Area</h3>
              <label className="text-sm text-muted-foreground">Selected: {selectedArea} sq ft</label>
              <input type="range" min={plot.minArea} max={plot.totalArea} step={50} value={selectedArea} onChange={(e) => setSelectedArea(Number(e.target.value))} className="w-full mt-2 mb-4 accent-primary" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{plot.minArea} sqft</span>
                <span className="text-sm text-muted-foreground">{plot.totalArea} sqft</span>
              </div>
              <div className="mt-4 text-center bg-card rounded-xl p-4 border border-border">
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(totalPrice)}</p>
              </div>
            </div>

            <Button onClick={handleAddToCart} size="lg" className="w-full">
              <ShoppingCart size={18} className="mr-2" /> Add to Cart ({selectedArea} sqft)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
