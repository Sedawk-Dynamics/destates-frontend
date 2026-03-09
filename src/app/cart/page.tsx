"use client";

import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Button from "@/components/ui/Button";
import { ShoppingCart, Trash2, Package, ArrowLeft } from "lucide-react";
import { formatCurrency, formatPrice } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, loading, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="py-20 text-center">
        <div className="max-w-md mx-auto px-4">
          <ShoppingCart size={64} className="text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Please Login</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your cart.</p>
          <Button href="/">Go to Home</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[60vh] text-muted-foreground">Loading cart...</div>;
  }

  const handleRemove = async (id: string) => {
    try {
      await removeItem(id);
      toast.success("Item removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const getItemPrice = (item: any) => {
    if (item.itemType === "PROPERTY" && item.details) return item.details.price * item.quantity;
    if (item.itemType === "PLOT" && item.details) return item.details.pricePerSqft * (item.selectedArea || item.details.minArea);
    return 0;
  };

  const total = items.reduce((sum, item) => sum + getItemPrice(item), 0);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft size={16} /> Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <AnimatedSection>
            <div className="text-center py-16">
              <ShoppingCart size={80} className="text-muted-foreground/20 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-foreground mb-2">Your Cart is Empty</h2>
              <p className="text-muted-foreground mb-6">Browse our properties and land plots to start investing.</p>
              <div className="flex justify-center gap-4">
                <Button href="/investments">Browse Properties</Button>
                <Button href="/plots" variant="outline">Browse Plots</Button>
              </div>
            </div>
          </AnimatedSection>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <AnimatedSection key={item.id}>
                  <div className="bg-card rounded-xl p-6 border border-border shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <Package size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground">{item.details ? (item.details as any).name : "Item"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.itemType === "PROPERTY" ? "Investment Property" : `Land Plot - ${item.selectedArea} sqft`}
                      </p>
                    </div>
                    <p className="text-lg font-bold text-primary">{formatCurrency(getItemPrice(item))}</p>
                    <button onClick={() => handleRemove(item.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </AnimatedSection>
              ))}
              <button
                onClick={async () => { await clearCart(); toast.success("Cart cleared"); }}
                className="text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
                Clear Cart
              </button>
            </div>

            <div className="lg:col-span-1">
              <AnimatedSection>
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm sticky top-24">
                  <h3 className="text-lg font-bold text-card-foreground mb-4">Order Summary</h3>
                  <div className="space-y-3 text-sm mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Items ({items.length})</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Platform Fee</span>
                      <span>₹0</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-bold text-foreground text-lg">
                      <span>Total</span>
                      <span className="text-primary">{formatCurrency(total)}</span>
                    </div>
                  </div>
                  <Button className="w-full" onClick={() => toast.success("Checkout coming soon!")}>
                    Proceed to Checkout
                  </Button>
                </div>
              </AnimatedSection>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
