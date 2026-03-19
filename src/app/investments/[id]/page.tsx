"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, TrendingUp, Maximize, Building, Shield, CheckCircle, ShoppingCart, ShieldCheck } from "lucide-react";
import { Property } from "@/types";
import { getPropertyById } from "@/lib/api";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatCurrency, resolveImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [investAmount, setInvestAmount] = useState(500000);
  const [insuranceSelected, setInsuranceSelected] = useState(false);
  const [insurancePlan, setInsurancePlan] = useState<number>(2000);
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    getPropertyById(id).then((res) => setProperty(res.data)).catch(() => {});
  }, [id]);

  if (!property) {
    return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Loading...</div>;
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }
    try {
      await addItem({ itemType: "PROPERTY", itemId: property.id });
      toast.success("Added to cart!");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const annualReturn = (investAmount * property.expectedROI) / 100;
  const monthlyReturn = property.monthlyYield ? (investAmount * property.monthlyYield) / 100 : 0;

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/investments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={16} /> Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image Gallery */}
          <div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-80 md:h-[400px] rounded-xl overflow-hidden mb-3">
              <Image src={resolveImageUrl(property.images[selectedImage])} alt={property.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant={property.status === "AVAILABLE" ? "success" : "warning"}>
                  {property.status === "AVAILABLE" ? "Available" : "Limited"}
                </Badge>
                {property.reraRegistered && <Badge variant="primary">RERA Registered</Badge>}
              </div>
            </motion.div>
            <div className="flex gap-2">
              {property.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 ${i === selectedImage ? "border-primary" : "border-transparent"}`}>
                  <Image src={resolveImageUrl(img)} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{property.name}</h1>
            <p className="text-muted-foreground flex items-center gap-1 mb-6"><MapPin size={16} /> {property.location}, {property.city}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Total Price</p>
                <p className="text-lg font-bold text-primary">{formatCurrency(property.price)}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Expected ROI</p>
                <p className="text-lg font-bold text-green-600 flex items-center justify-center gap-1"><TrendingUp size={16} /> {property.expectedROI}%</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Area</p>
                <p className="text-lg font-bold text-foreground flex items-center justify-center gap-1"><Maximize size={14} /> {property.area} sqft</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Available</p>
                <p className="text-lg font-bold text-foreground flex items-center justify-center gap-1"><Building size={14} /> {property.availableUnits} units</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-2">About</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{property.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-3">Highlights</h3>
              <div className="grid grid-cols-2 gap-2">
                {property.highlights.map((h) => (
                  <span key={h} className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle size={14} className="text-green-500 shrink-0" /> {h}</span>
                ))}
              </div>
            </div>

            {/* ROI Calculator */}
            <div className="bg-muted/50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><TrendingUp size={18} className="text-primary" /> ROI Calculator</h3>
              <label className="text-sm text-muted-foreground">Investment Amount: {formatCurrency(investAmount)}</label>
              <input type="range" min={100000} max={property.price} step={100000} value={investAmount} onChange={(e) => setInvestAmount(Number(e.target.value))} className="w-full mt-2 mb-4 accent-primary" />
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Annual Return</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(annualReturn)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Monthly Yield</p>
                  <p className="text-lg font-bold text-primary">{formatCurrency(monthlyReturn)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">5-Year Value</p>
                  <p className="text-lg font-bold text-foreground">{formatCurrency(investAmount * Math.pow(1 + property.expectedROI / 100, 5))}</p>
                </div>
              </div>
            </div>

            {/* Optional Insurance */}
            <div className="bg-muted/50 rounded-xl p-6 mb-6 border border-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary" /> Optional Insurance
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={insuranceSelected}
                    onChange={(e) => setInsuranceSelected(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Secure your investment against damage, natural calamities, or other unforeseen issues with our optional insurance coverage.
              </p>
              {insuranceSelected && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">Select monthly premium:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[2000, 3500, 5000].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setInsurancePlan(amount)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${
                          insurancePlan === amount
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:border-primary/50"
                        }`}
                      >
                        ₹{amount.toLocaleString("en-IN")}/mo
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Coverage: structural damage, fire, flooding & more. <a href="/terms#insurance" className="text-primary hover:underline">View full details</a>
                  </p>
                </div>
              )}
            </div>

            <Button onClick={handleAddToCart} size="lg" className="w-full">
              <ShoppingCart size={18} className="mr-2" /> Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
