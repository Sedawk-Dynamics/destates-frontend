"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, TrendingUp, Maximize, Layers, Shield, CheckCircle, CreditCard, ShieldCheck } from "lucide-react";
import { Property, InsurancePlan } from "@/types";
import { getPropertyById, createInvestmentOrder, verifyInvestmentPayment, getInsurancePlans } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatCurrency, formatPrice, resolveImageUrl } from "@/lib/utils";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [fractions, setFractions] = useState(0);
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [paying, setPaying] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    getPropertyById(id).then((res) => {
      setProperty(res.data);
      setFractions(res.data.minFractions || 1);
    }).catch(() => {});
    getInsurancePlans(id).then((res) => setPlans(res.data)).catch(() => {});
  }, [id]);

  // Load Razorpay script
  useEffect(() => {
    if (document.getElementById("razorpay-script")) return;
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleInvest = useCallback(async () => {
    if (!isAuthenticated) {
      toast.error("Please login to invest");
      return;
    }
    if (!property) return;
    if (fractions < 1 || fractions > property.availableFractions) {
      toast.error(`Select between 1 and ${property.availableFractions} fractions`);
      return;
    }

    setPaying(true);
    try {
      const res = await createInvestmentOrder({
        propertyId: property.id,
        fractions,
      });

      const { orderId, amount, currency, key } = res.data;

      const options = {
        key,
        amount,
        currency,
        name: "Destates",
        description: `${fractions} fraction(s) of ${property.name}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await verifyInvestmentPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Investment successful! Check My Investments for details.");
            const updated = await getPropertyById(id);
            setProperty(updated.data);
            setFractions(1);
          } catch {
            toast.error("Payment verification failed. Contact support if money was deducted.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#6366f1" },
        modal: { ondismiss: () => setPaying(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed. Please try again.");
        setPaying(false);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Failed to create order");
    } finally {
      setPaying(false);
    }
  }, [isAuthenticated, property, fractions, id, user]);

  if (!property) {
    return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Loading...</div>;
  }

  const minF = property.minFractions || 1;
  const maxF = property.maxFractions || property.availableFractions;
  const totalCost = fractions * property.pricePerFraction;
  const annualReturn = (totalCost * property.expectedROI) / 100;
  const monthlyReturn = property.monthlyYield ? (totalCost * property.monthlyYield) / 100 : 0;
  const annualRentalIncome = monthlyReturn * (property.rentalYieldMonths || 12);
  const capitalGain = (totalCost * (property.capitalAppreciation || 0)) / 100;

  // Projection calculation
  const projYears = property.projectionYears || 5;
  let projectedValue = totalCost;
  let totalRentalIncome = 0;
  for (let y = 0; y < projYears; y++) {
    projectedValue *= (1 + (property.capitalAppreciation || 0) / 100);
    totalRentalIncome += monthlyReturn * (property.rentalYieldMonths || 12);
  }
  const totalProjectedReturn = projectedValue - totalCost + totalRentalIncome;

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
                <Badge variant={property.status === "AVAILABLE" ? "success" : property.status === "LIMITED" ? "warning" : "default"}>
                  {property.status === "AVAILABLE" ? "Available" : property.status === "LIMITED" ? "Limited" : "Sold Out"}
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
            <p className="text-muted-foreground flex items-center gap-1 mb-4"><MapPin size={16} /> {property.location}, {property.city}</p>

            {property.disabled && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                <Shield size={20} className="text-red-500 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-red-700">This property has been disabled</p>
                  <p className="text-xs text-red-600">New investments are currently paused by the admin. Your existing holdings remain safe.</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">Property Value</p>
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
                <p className="text-lg font-bold text-foreground flex items-center justify-center gap-1"><Layers size={14} /> {property.availableFractions}/{property.totalFractions}</p>
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

            {/* Fractional Investment Section */}
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 mb-6 border border-primary/20">
              <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                <Layers size={18} className="text-primary" /> Invest in Fractions
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Buy fractional ownership starting at {formatPrice(property.pricePerFraction)} per fraction
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">
                    Number of Fractions (min {minF}{maxF < property.availableFractions ? `, max ${maxF}` : ""}, {property.availableFractions} available)
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setFractions(Math.max(minF, fractions - 1))}
                      className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-lg font-bold hover:bg-muted transition-colors"
                      disabled={fractions <= minF}
                    >-</button>
                    <input
                      type="number"
                      min={minF}
                      max={Math.min(maxF, property.availableFractions)}
                      value={fractions}
                      onChange={(e) => {
                        const val = Math.max(minF, Math.min(Math.min(maxF, property.availableFractions), Number(e.target.value) || minF));
                        setFractions(val);
                      }}
                      className="w-24 text-center px-3 py-2 bg-card border border-border rounded-lg text-foreground font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      onClick={() => setFractions(Math.min(Math.min(maxF, property.availableFractions), fractions + 1))}
                      className="w-10 h-10 rounded-lg bg-card border border-border flex items-center justify-center text-lg font-bold hover:bg-muted transition-colors"
                      disabled={fractions >= Math.min(maxF, property.availableFractions)}
                    >+</button>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4 border border-border">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Price per fraction</span>
                    <span className="text-foreground font-medium">{formatPrice(property.pricePerFraction)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Fractions</span>
                    <span className="text-foreground font-medium">x {fractions}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between">
                    <span className="font-semibold text-foreground">Total Investment</span>
                    <span className="font-bold text-primary text-lg">{formatPrice(totalCost)}</span>
                  </div>
                </div>

                {property.roiCalculatorEnabled && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="text-center bg-card rounded-lg p-3 border border-border">
                        <p className="text-xs text-muted-foreground">Annual Return</p>
                        <p className="text-sm font-bold text-green-600">{formatPrice(annualReturn)}</p>
                        <p className="text-[10px] text-muted-foreground">{property.expectedROI}% p.a.</p>
                      </div>
                      <div className="text-center bg-card rounded-lg p-3 border border-border">
                        <p className="text-xs text-muted-foreground">Monthly Yield</p>
                        <p className="text-sm font-bold text-primary">{formatPrice(monthlyReturn)}</p>
                        <p className="text-[10px] text-muted-foreground">{property.rentalYieldMonths || 12} months/yr</p>
                      </div>
                      <div className="text-center bg-card rounded-lg p-3 border border-border">
                        <p className="text-xs text-muted-foreground">Capital Growth</p>
                        <p className="text-sm font-bold text-orange-600">{formatPrice(capitalGain)}/yr</p>
                        <p className="text-[10px] text-muted-foreground">{property.capitalAppreciation || 0}% p.a.</p>
                      </div>
                      <div className="text-center bg-card rounded-lg p-3 border border-border">
                        <p className="text-xs text-muted-foreground">Annual Rental</p>
                        <p className="text-sm font-bold text-blue-600">{formatPrice(annualRentalIncome)}</p>
                        <p className="text-[10px] text-muted-foreground">{property.rentalYieldMonths || 12} months</p>
                      </div>
                    </div>

                    {/* Projection */}
                    <div className="bg-card rounded-lg p-4 border border-border">
                      <p className="text-xs text-muted-foreground mb-2 font-medium">{projYears}-Year Projection</p>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Investment</span>
                        <span className="text-foreground">{formatPrice(totalCost)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Property Value ({projYears}yr)</span>
                        <span className="text-orange-600">{formatPrice(projectedValue)}</span>
                      </div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Total Rental Income</span>
                        <span className="text-blue-600">{formatPrice(totalRentalIncome)}</span>
                      </div>
                      <div className="border-t border-border pt-2 mt-2 flex justify-between font-semibold">
                        <span className="text-foreground">Total Return</span>
                        <span className="text-green-600">{formatPrice(totalProjectedReturn)}</span>
                      </div>
                    </div>

                    {/* Info badges */}
                    <div className="flex flex-wrap gap-2">
                      {property.lockInPeriod > 0 && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">Lock-in: {property.lockInPeriod} months</span>
                      )}
                      {property.lockInPeriod === 0 && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">No lock-in period</span>
                      )}
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Rental: {property.rentalYieldMonths || 12} months/year</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Insurance Plans */}
            {plans.length > 0 && (
              <div className="bg-muted/50 rounded-xl p-6 mb-6 border border-border">
                <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-primary" /> Optional Insurance
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Protect your investment with insurance. You can purchase insurance from My Investments after investing.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {plans.map((plan) => (
                    <div key={plan.id} className="bg-card rounded-lg p-4 border border-border">
                      <p className="font-semibold text-foreground text-sm">{plan.name}</p>
                      <p className="text-xl font-bold text-primary mt-1">{formatPrice(plan.monthlyPremium)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{plan.coverage}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={handleInvest}
              size="lg"
              className="w-full"
              disabled={paying || property.disabled || property.status === "SOLD_OUT" || property.availableFractions === 0}
            >
              <CreditCard size={18} className="mr-2" />
              {property.disabled ? "Property Disabled" : property.status === "SOLD_OUT" ? "Sold Out" : paying ? "Processing..." : `Invest ${formatPrice(totalCost)}`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
