"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building, MapPin, Home as HomeIcon,
  MessageSquare, Users, Star, Menu, X, LogOut, ChevronLeft, Layers, User, ShieldCheck,
} from "lucide-react";
import AdminGuard from "@/components/admin/AdminGuard";
import { useAuth } from "@/lib/auth-context";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/properties", label: "Properties", icon: Building },
  { href: "/admin/investments", label: "Investments", icon: Layers },
  { href: "/admin/insurance", label: "Insurance", icon: ShieldCheck },
  { href: "/admin/pgs", label: "PG Listings", icon: HomeIcon },
  { href: "/admin/testimonials", label: "Testimonials", icon: Star },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-muted/30 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col fixed inset-y-0 z-50">
          <div className="flex flex-col h-full bg-card border-r border-border">
            <div className="h-16 flex items-center justify-between px-6 border-b border-border">
              <span className="text-lg font-bold text-primary">Destates Admin</span>
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft size={18} />
              </Link>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <link.icon size={18} />
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-border">
              <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              <div className="mt-3 flex items-center gap-4">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <User size={14} /> Profile
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border flex items-center px-4 gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-foreground">
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span className="text-lg font-bold text-primary">Destates Admin</span>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <>
            <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
              <div className="h-14 flex items-center px-6 border-b border-border">
                <span className="text-lg font-bold text-primary">Admin</span>
              </div>
              <nav className="px-3 py-4 space-y-1">
                {sidebarLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    <link.icon size={18} />
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </>
        )}

        {/* Main Content */}
        <main className="flex-1 lg:pl-64 pt-14 lg:pt-0">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
