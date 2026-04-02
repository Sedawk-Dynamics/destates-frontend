"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, TrendingUp, Maximize, Layers, Shield, CheckCircle, CreditCard, ShieldCheck, Clock, BarChart3, IndianRupee, Building } from "lucide-react";
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
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    getPropertyById(id).then((res) => {
      setProperty(res.data);
      setFractions(res.data.minFractions || 1);
    }).catch(() => {});
    getInsurancePlans(id).then((res) => setPlans(res.data)).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (document.getElementById("razorpay-script")) return;
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const selectedPlan = plans.find((p) => p.id === selectedPlanId) || null;

  const handleInvest = useCallback(async () => {
    if (!isAuthenticated) { toast.error("Please login to invest"); return; }
    if (!property) return;
    setPaying(true);
    try {
      const res = await createInvestmentOrder({ propertyId: property.id, fractions, insurancePlanId: selectedPlanId || undefined });
      const { orderId, amount, currency, key } = res.data;
      const planId = selectedPlanId;
      const options = {
        key, amount, currency, name: "Destates",
        description: `${fractions} fraction(s) of ${property.name}${selectedPlan ? ` + ${selectedPlan.name}` : ""}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await verifyInvestmentPayment({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature, insurancePlanId: planId || undefined });
            toast.success(planId ? "Investment + Insurance activated!" : "Investment successful!");
            const updated = await getPropertyById(id);
            setProperty(updated.data);
            setFractions(updated.data.minFractions || 1);
            setSelectedPlanId(null);
          } catch { toast.error("Payment verification failed. Contact support."); }
        },
        prefill: { name: user?.name || "", email: user?.email || "", contact: user?.phone || "" },
        theme: { color: "#6366f1" },
        modal: { ondismiss: () => setPaying(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => { toast.error("Payment failed."); setPaying(false); });
      rzp.open();
    } catch (err: any) { toast.error(err.message || "Failed to create order"); }
    finally { setPaying(false); }
  }, [isAuthenticated, property, fractions, id, user, selectedPlanId, selectedPlan]);

  if (!property) {
    return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Loading...</div>;
  }

  const minF = property.minFractions || 1;
  const maxF = property.maxFractions || property.availableFractions;
  const investmentCost = fractions * property.pricePerFraction;
  const insuranceCost = selectedPlan?.monthlyPremium || 0;
  const totalCost = investmentCost + insuranceCost;
  const annualReturn = (investmentCost * property.expectedROI) / 100;
  const monthlyReturn = property.monthlyYield ? (investmentCost * property.monthlyYield) / 100 : 0;
  const annualRentalIncome = monthlyReturn * (property.rentalYieldMonths || 12);
  const capitalGain = (investmentCost * (property.capitalAppreciation || 0)) / 100;
  const projYears = property.projectionYears || 5;
  let projectedValue = investmentCost;
  let totalRentalIncome = 0;
  for (let y = 0; y < projYears; y++) {
    projectedValue *= (1 + (property.capitalAppreciation || 0) / 100);
    totalRentalIncome += monthlyReturn * (property.rentalYieldMonths || 12);
  }
  const totalProjectedReturn = projectedValue - investmentCost + totalRentalIncome;

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/investments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={16} /> Back to Properties
        </Link>

        {/* ─── HERO: Image Gallery + Key Stats ─── */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {/* Main Image */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2 relative h-72 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden">
              <Image src={resolveImageUrl(property.images[selectedImage])} alt={property.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex gap-2">
                {property.disabled ? (
                  <Badge variant="default">Disabled</Badge>
                ) : (
                  <Badge variant={property.status === "AVAILABLE" ? "success" : property.status === "LIMITED" ? "warning" : "default"}>
                    {property.status === "AVAILABLE" ? "Available" : property.status === "LIMITED" ? "Limited" : "Sold Out"}
                  </Badge>
                )}
                {property.reraRegistered && <Badge variant="primary">RERA Registered</Badge>}
                {property.readyToMove && <Badge variant="success">Ready to Move</Badge>}
              </div>
              {/* Title overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{property.name}</h1>
                <p className="text-white/80 flex items-center gap-1 text-sm"><MapPin size={14} /> {property.location}, {property.city}</p>
              </div>
            </motion.div>

            {/* Thumbnail grid */}
            <div className="hidden lg:grid grid-rows-3 gap-3">
              {property.images.slice(0, 3).map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`relative rounded-xl overflow-hidden border-2 transition-all ${i === selectedImage ? "border-primary ring-2 ring-primary/30" : "border-transparent hover:border-primary/30"}`}>
                  <Image src={resolveImageUrl(img)} alt="" fill className="object-cover" sizes="300px" />
                </button>
              ))}
            </div>
            {/* Mobile thumbnails */}
            <div className="flex lg:hidden gap-2 mt-1">
              {property.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)} className={`relative w-20 h-16 rounded-lg overflow-hidden border-2 ${i === selectedImage ? "border-primary" : "border-transparent"}`}>
                  <Image src={resolveImageUrl(img)} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          </div>

          {/* Key stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <IndianRupee size={16} className="text-primary mx-auto mb-1" />
              <p className="text-lg font-bold text-primary">{formatCurrency(property.price)}</p>
              <p className="text-[10px] text-muted-foreground">Property Value</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <TrendingUp size={16} className="text-green-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-green-600">{property.expectedROI}%</p>
              <p className="text-[10px] text-muted-foreground">Expected ROI</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <Maximize size={16} className="text-foreground mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{property.area.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">Area (sq ft)</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <Layers size={16} className="text-foreground mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{property.availableFractions}<span className="text-muted-foreground font-normal text-sm">/{property.totalFractions}</span></p>
              <p className="text-[10px] text-muted-foreground">Fractions Left</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <BarChart3 size={16} className="text-orange-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-orange-500">{property.capitalAppreciation || 0}%</p>
              <p className="text-[10px] text-muted-foreground">Capital Growth</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <IndianRupee size={16} className="text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold text-blue-600">{formatCurrency(property.pricePerFraction)}</p>
              <p className="text-[10px] text-muted-foreground">Per Fraction</p>
            </div>
          </div>
        </div>

        {property.disabled && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <Shield size={20} className="text-red-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-red-700">This property has been disabled</p>
              <p className="text-xs text-red-600">New investments are currently paused. Your existing holdings remain safe.</p>
            </div>
          </div>
        )}

        {/* ─── BODY: Info Left + Investment Sidebar Right ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Property details */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Building size={18} className="text-primary" /> About this Property</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{property.description}</p>
            </div>

            {/* Highlights */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><CheckCircle size={18} className="text-green-500" /> Highlights</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.highlights.map((h) => (
                  <div key={h} className="flex items-center gap-3 bg-muted/30 rounded-lg px-4 py-3">
                    <CheckCircle size={15} className="text-green-500 shrink-0" />
                    <span className="text-sm text-foreground">{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ROI Calculator */}
            {property.roiCalculatorEnabled && (
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-green-600" /> ROI Calculator</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="text-center bg-green-50 rounded-lg p-4 border border-green-200">
                    <p className="text-xs text-muted-foreground mb-1">Annual Return</p>
                    <p className="text-lg font-bold text-green-600">{formatPrice(annualReturn)}</p>
                    <p className="text-[10px] text-green-600/70">{property.expectedROI}% p.a.</p>
                  </div>
                  <div className="text-center bg-primary/5 rounded-lg p-4 border border-primary/20">
                    <p className="text-xs text-muted-foreground mb-1">Monthly Yield</p>
                    <p className="text-lg font-bold text-primary">{formatPrice(monthlyReturn)}</p>
                    <p className="text-[10px] text-primary/70">{property.monthlyYield || 0}%</p>
                  </div>
                  <div className="text-center bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <p className="text-xs text-muted-foreground mb-1">Capital Growth</p>
                    <p className="text-lg font-bold text-orange-600">{formatPrice(capitalGain)}</p>
                    <p className="text-[10px] text-orange-600/70">{property.capitalAppreciation}% p.a.</p>
                  </div>
                  <div className="text-center bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-xs text-muted-foreground mb-1">Annual Rental</p>
                    <p className="text-lg font-bold text-blue-600">{formatPrice(annualRentalIncome)}</p>
                    <p className="text-[10px] text-blue-600/70">{property.rentalYieldMonths} mo/yr</p>
                  </div>
                </div>

                {/* Projection table */}
                <div className="bg-muted/30 rounded-lg p-5 border border-border">
                  <p className="text-sm font-semibold text-foreground mb-3">{projYears}-Year Projection for {formatPrice(investmentCost)}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Your Investment</span><span className="font-medium">{formatPrice(investmentCost)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Projected Property Value</span><span className="font-medium text-orange-600">{formatPrice(projectedValue)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Total Rental Income</span><span className="font-medium text-blue-600">{formatPrice(totalRentalIncome)}</span></div>
                    <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                      <span className="text-foreground">Total Estimated Return</span>
                      <span className="text-green-600">{formatPrice(totalProjectedReturn)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {property.lockInPeriod > 0 ? (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-full flex items-center gap-1"><Clock size={12} /> Lock-in: {property.lockInPeriod} months</span>
                  ) : (
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full flex items-center gap-1"><Clock size={12} /> No lock-in</span>
                  )}
                  <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full">Rental: {property.rentalYieldMonths || 12} months/year</span>
                  <span className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full">Min {minF} fraction{minF > 1 ? "s" : ""}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Investment Sidebar (sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Fraction selector */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-5 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                  <Layers size={18} className="text-primary" /> Invest
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Starting at {formatPrice(property.pricePerFraction)} per fraction
                </p>

                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Fractions ({property.availableFractions} available)
                </label>
                <div className="flex items-center gap-2 mb-3">
                  <button onClick={() => setFractions(Math.max(minF, fractions - 1))} className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-base font-bold hover:bg-muted transition-colors" disabled={fractions <= minF}>-</button>
                  <input
                    type="number" min={minF} max={Math.min(maxF, property.availableFractions)} value={fractions}
                    onChange={(e) => setFractions(Math.max(minF, Math.min(Math.min(maxF, property.availableFractions), Number(e.target.value) || minF)))}
                    className="flex-1 text-center px-2 py-2 bg-card border border-border rounded-lg text-foreground font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button onClick={() => setFractions(Math.min(Math.min(maxF, property.availableFractions), fractions + 1))} className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-base font-bold hover:bg-muted transition-colors" disabled={fractions >= Math.min(maxF, property.availableFractions)}>+</button>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-primary">{formatPrice(investmentCost)}</span>
                </div>
              </div>

              {/* Insurance Selection */}
              {plans.length > 0 && (
                <div className="bg-card rounded-xl p-5 border border-border">
                  <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                    <ShieldCheck size={16} className="text-blue-500" /> Insurance <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedPlanId(null)}
                      className={`w-full text-left rounded-lg px-3 py-2.5 border text-sm transition-colors ${selectedPlanId === null ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlanId === null ? "border-primary" : "border-muted-foreground/30"}`}>
                            {selectedPlanId === null && <div className="w-2 h-2 rounded-full bg-primary" />}
                          </div>
                          <span className="text-foreground">No Insurance</span>
                        </div>
                        <span className="text-muted-foreground text-xs">Free</span>
                      </div>
                    </button>
                    {plans.map((plan) => (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`w-full text-left rounded-lg px-3 py-2.5 border text-sm transition-colors ${selectedPlanId === plan.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                      >
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlanId === plan.id ? "border-primary" : "border-muted-foreground/30"}`}>
                              {selectedPlanId === plan.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                            </div>
                            <span className="text-foreground font-medium">{plan.name}</span>
                          </div>
                          <span className="font-bold text-primary text-xs">{formatPrice(plan.monthlyPremium)}<span className="font-normal text-muted-foreground">/mo</span></span>
                        </div>
                        <p className="text-[11px] text-muted-foreground ml-6 leading-relaxed line-clamp-2">{plan.coverage}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Summary */}
              <div className="bg-card rounded-xl p-5 border border-border">
                <div className="space-y-2 text-sm mb-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Investment ({fractions} fractions)</span>
                    <span className="text-foreground font-medium">{formatPrice(investmentCost)}</span>
                  </div>
                  {selectedPlan && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{selectedPlan.name} Insurance</span>
                      <span className="text-foreground font-medium">{formatPrice(insuranceCost)}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">{formatPrice(totalCost)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleInvest}
                  size="lg"
                  className="w-full"
                  disabled={paying || property.disabled || property.status === "SOLD_OUT" || property.availableFractions === 0}
                >
                  <CreditCard size={18} className="mr-2" />
                  {property.disabled ? "Property Disabled" : property.status === "SOLD_OUT" ? "Sold Out" : paying ? "Processing..." : `Pay ${formatPrice(totalCost)}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
