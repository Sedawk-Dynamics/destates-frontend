"use client";

import { useEffect, useState } from "react";
import { getAdminInvestments } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function AdminInvestments() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminInvestments()
      .then((r) => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = items.reduce((sum, inv) => sum + inv.amountPaid, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Investments</h1>
        <div className="text-sm text-muted-foreground">
          Total Revenue: <span className="font-bold text-primary">{formatPrice(totalRevenue)}</span>
        </div>
      </div>

      {loading ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">Loading...</div>
      ) : (
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Investor</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Property</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fractions</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((inv) => (
                  <tr key={inv.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{inv.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{inv.user?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{inv.property?.name}</p>
                      <p className="text-xs text-muted-foreground">{inv.property?.city}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">{inv.fractions}</td>
                    <td className="px-4 py-3 text-primary font-medium">{formatPrice(inv.amountPaid)}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(inv.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No investments yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
