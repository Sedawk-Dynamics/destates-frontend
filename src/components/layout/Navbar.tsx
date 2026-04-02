"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, User, LogOut, LayoutDashboard, Layers, Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getUnreadNotificationCount, getNotifications, markAllNotificationsRead, markNotificationRead } from "@/lib/api";
import { Notification } from "@/types";
import AuthModal from "@/components/auth/AuthModal";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/investments", label: "Properties" },
  { href: "/pgs", label: "PG Listings" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();

  // Poll unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await getUnreadNotificationCount();
      setUnreadCount(res.data.count);
    } catch {}
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  const openNotifications = async () => {
    if (notifOpen) {
      setNotifOpen(false);
      return;
    }
    setUserMenu(false);
    setNotifOpen(true);
    setNotifLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data);
    } catch {} finally {
      setNotifLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {}
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Destates" width={140} height={40} className="h-9 w-auto" />
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/my-investments"
                    className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      pathname === "/my-investments"
                        ? "text-primary bg-primary/10"
                        : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <Layers size={16} /> My Investments
                  </Link>

                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      onClick={openNotifications}
                      className="relative p-2 text-foreground/70 hover:text-primary transition-colors"
                    >
                      <Bell size={20} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                    <AnimatePresence>
                      {notifOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                        >
                          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
                            {unreadCount > 0 && (
                              <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-primary hover:underline"
                              >
                                Mark all read
                              </button>
                            )}
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {notifLoading ? (
                              <div className="p-6 text-center text-muted-foreground text-sm">Loading...</div>
                            ) : notifications.length === 0 ? (
                              <div className="p-6 text-center text-muted-foreground text-sm">No notifications</div>
                            ) : (
                              notifications.map((n) => (
                                <div
                                  key={n.id}
                                  onClick={() => !n.read && handleMarkRead(n.id)}
                                  className={`px-4 py-3 border-b border-border last:border-b-0 cursor-pointer transition-colors ${
                                    n.read ? "bg-card" : "bg-primary/5 hover:bg-primary/10"
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    {!n.read && (
                                      <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                                    )}
                                    <div className={!n.read ? "" : "pl-4"}>
                                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                                      <p className="text-[10px] text-muted-foreground/60 mt-1">
                                        {new Date(n.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => { setUserMenu(!userMenu); setNotifOpen(false); }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium"
                    >
                      <User size={16} />
                      <span className="hidden sm:inline">{user?.name?.split(" ")[0]}</span>
                    </button>
                    <AnimatePresence>
                      {userMenu && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute right-0 mt-2 w-44 bg-card border border-border rounded-xl shadow-lg overflow-hidden"
                        >
                          <Link
                            href="/profile"
                            onClick={() => setUserMenu(false)}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <User size={14} /> My Profile
                          </Link>
                          <Link
                            href="/my-investments"
                            onClick={() => setUserMenu(false)}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors sm:hidden"
                          >
                            <Layers size={14} /> My Investments
                          </Link>
                          {user?.role === "ADMIN" && (
                            <Link
                              href="/admin"
                              onClick={() => setUserMenu(false)}
                              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                            >
                              <LayoutDashboard size={14} /> Admin Panel
                            </Link>
                          )}
                          <button
                            onClick={() => { logout(); setUserMenu(false); }}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                          >
                            <LogOut size={14} /> Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-[var(--radius)] hover:opacity-90 transition-opacity"
                >
                  Login / Sign Up
                </button>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-foreground">
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-card border-t border-border"
            >
              <div className="px-4 py-3 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                      pathname === link.href
                        ? "text-primary bg-primary/10"
                        : "text-foreground/70 hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
