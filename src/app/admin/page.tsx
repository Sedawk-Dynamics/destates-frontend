"use client";

import { useEffect, useState } from "react";
import { getAdminStats } from "@/lib/api";
import { DashboardStats } from "@/types";
import { Users, Building, MapPin, Home, MessageSquare } from "lucide-react";

const statCards = [
  { key: "users" as const, label: "Total Users", icon: Users },
  { key: "properties" as const, label: "Properties", icon: Building },
  { key: "plots" as const, label: "Land Plots", icon: MapPin },
  { key: "pgs" as const, label: "PG Listings", icon: Home },
  { key: "inquiries" as const, label: "Inquiries", icon: MessageSquare },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl border border-border p-6 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-muted mb-4" />
              <div className="h-8 w-16 bg-muted rounded mb-2" />
              <div className="h-4 w-24 bg-muted rounded" />
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statCards.map((card) => (
            <div key={card.key} className="bg-card rounded-xl border border-border p-6 card-glow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                <card.icon size={24} strokeWidth={1.5} />
              </div>
              <p className="text-3xl font-bold text-foreground">{stats[card.key]}</p>
              <p className="text-sm text-muted-foreground mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Failed to load stats.</p>
      )}
    </div>
  );
}
