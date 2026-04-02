"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/auth-context";
import { getMyInvestments, getInsurancePlans, createInsuranceOrder, verifyInsurancePayment } from "@/lib/api";
import { Investment, InsurancePlan } from "@/types";
import { formatPrice, formatCurrency, resolveImageUrl } from "@/lib/utils";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { Layers, TrendingUp, ArrowLeft, Building, Calendar, ShieldCheck, X } from "lucide-react";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function MyInvestmentsPage() {
  const { user, isAuthenticated } = useAuth();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [insuranceModal, setInsuranceModal] = useState<Investment | null>(null);
  const [plans, setPlans] = useState<InsurancePlan[]>([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [buying, setBuying] = useState(false);

  const fetchInvestments = useCallback(async () => {
    if (!isAuthenticated) { setLoading(false); return; }
    try {
      const res = await getMyInvestments();
      setInvestments(res.data);
    } catch {} finally { setLoading(false); }
  }, [isAuthenticated]);

  useEffect(() => { fetchInvestments(); }, [fetchInvestments]);

  // Load Razorpay script
  useEffect(() => {
    if (document.getElementById("razorpay-script")) return;
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openInsuranceModal = async (inv: Investment) => {
    setInsuranceModal(inv);
    setPlansLoading(true);
    try {
      const res = await getInsurancePlans(inv.propertyId);
      setPlans(res.data);
    } catch { setPlans([]); }
    finally { setPlansLoading(false); }
  };

  const handleBuyInsurance = async (planId: string) => {
    if (!insuranceModal) return;
    setBuying(true);
    try {
      const res = await createInsuranceOrder({
        investmentId: insuranceModal.id,
        insurancePlanId: planId,
      });

      const { orderId, amount, currency, key } = res.data;
      const plan = plans.find((p) => p.id === planId);

      const options = {
        key,
        amount,
        currency,
        name: "Destates Insurance",
        description: `${plan?.name || "Insurance"} — ${insuranceModal.property?.name}`,
        order_id: orderId,
        handler: async (response: any) => {
          try {
            await verifyInsurancePayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success("Insurance activated successfully!");
            setInsuranceModal(null);
            fetchInvestments();
          } catch {
            toast.error("Insurance verification failed. Contact support.");
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: { color: "#6366f1" },
        modal: { ondismiss: () => setBuying(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        toast.error("Payment failed.");
        setBuying(false);
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || "Failed to create insurance order");
    } finally {
      setBuying(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto px-4">
          <Layers size={64} className="text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Please Login</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your investments.</p>
          <Button href="/">Go to Home</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Loading investments...</div>;
  }

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amountPaid, 0);
  const totalFractions = investments.reduce((sum, inv) => sum + inv.fractions, 0);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/investments" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={16} /> Browse Properties
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">My Investments</h1>

        {investments.length === 0 ? (
          <AnimatedSection>
            <div className="text-center py-16">
              <Layers size={80} className="text-muted-foreground/20 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">No Investments Yet</h2>
              <p className="text-muted-foreground mb-6">Start investing in fractional property ownership today.</p>
              <Button href="/investments">Browse Properties</Button>
            </div>
          </AnimatedSection>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-sm text-muted-foreground mb-1">Total Invested</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(totalInvested)}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-sm text-muted-foreground mb-1">Total Fractions Owned</p>
                <p className="text-2xl font-bold text-foreground">{totalFractions}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-sm text-muted-foreground mb-1">Properties Invested In</p>
                <p className="text-2xl font-bold text-foreground">
                  {new Set(investments.map((i) => i.propertyId)).size}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {investments.map((inv) => {
                const hasInsurance = inv.insurances && inv.insurances.length > 0;
                return (
                  <AnimatedSection key={inv.id}>
                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                      <div className="flex flex-col sm:flex-row">
                        {inv.property?.images?.[0] && (
                          <div className="relative w-full sm:w-48 h-40 sm:h-auto shrink-0">
                            <Image
                              src={resolveImageUrl(inv.property.images[0])}
                              alt={inv.property?.name || "Property"}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 100vw, 192px"
                            />
                          </div>
                        )}
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Link href={`/investments/${inv.propertyId}`} className="text-lg font-bold text-card-foreground hover:text-primary transition-colors">
                                {inv.property?.name || "Property"}
                              </Link>
                              {inv.property && (
                                <p className="text-sm text-muted-foreground">{inv.property.location}, {inv.property.city}</p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {hasInsurance && (
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1">
                                  <ShieldCheck size={11} /> Insured
                                </span>
                              )}
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                Completed
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1"><Layers size={12} /> Fractions</p>
                              <p className="font-bold text-foreground">{inv.fractions}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1"><Building size={12} /> Price/Fraction</p>
                              <p className="font-bold text-foreground">{formatPrice(inv.pricePerFraction)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp size={12} /> Amount Paid</p>
                              <p className="font-bold text-primary">{formatPrice(inv.amountPaid)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar size={12} /> Date</p>
                              <p className="font-bold text-foreground">
                                {new Date(inv.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                            </div>
                          </div>

                          {/* Insurance info or buy button */}
                          <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {inv.property && (
                                <>
                                  <span>Expected ROI: <strong className="text-green-600">{inv.property.expectedROI}% p.a.</strong></span>
                                  {inv.property.monthlyYield && (
                                    <span>Monthly Yield: <strong className="text-primary">{inv.property.monthlyYield}%</strong></span>
                                  )}
                                </>
                              )}
                            </div>
                            {hasInsurance ? (
                              <span className="text-xs text-blue-600 flex items-center gap-1">
                                <ShieldCheck size={13} /> {inv.insurances![0].insurancePlan?.name} — {formatPrice(inv.insurances![0].amountPaid)}/mo
                              </span>
                            ) : (
                              <button
                                onClick={() => openInsuranceModal(inv)}
                                className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                              >
                                <ShieldCheck size={13} /> Add Insurance
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Insurance Purchase Modal */}
      {insuranceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl border border-border w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <ShieldCheck size={20} className="text-primary" /> Buy Insurance
              </h2>
              <button onClick={() => setInsuranceModal(null)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 mb-4 text-sm">
              <p className="font-medium text-foreground">{insuranceModal.property?.name}</p>
              <p className="text-muted-foreground">{insuranceModal.fractions} fractions — {formatPrice(insuranceModal.amountPaid)} invested</p>
            </div>

            {plansLoading ? (
              <div className="py-8 text-center text-muted-foreground text-sm">Loading plans...</div>
            ) : plans.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground text-sm">No insurance plans available for this property.</div>
            ) : (
              <div className="space-y-3">
                {plans.map((plan) => (
                  <div key={plan.id} className="bg-card rounded-lg p-4 border border-border hover:border-primary/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{plan.name}</h3>
                      <p className="text-lg font-bold text-primary">{formatPrice(plan.monthlyPremium)}<span className="text-xs font-normal text-muted-foreground">/mo</span></p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{plan.coverage}</p>
                    <button
                      onClick={() => handleBuyInsurance(plan.id)}
                      disabled={buying}
                      className="w-full py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-[var(--radius)] hover:opacity-90 disabled:opacity-50"
                    >
                      {buying ? "Processing..." : `Pay ${formatPrice(plan.monthlyPremium)} & Activate`}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
