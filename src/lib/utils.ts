import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000) {
    const crores = amount / 10000000;
    return `₹${crores % 1 === 0 ? crores.toFixed(0) : crores.toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    const lakhs = amount / 100000;
    return `₹${lakhs % 1 === 0 ? lakhs.toFixed(0) : lakhs.toFixed(1)} L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString("en-IN");
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function resolveImageUrl(url: string): string {
  if (!url) return "/placeholder.svg";
  // Already a relative path — served via Next.js rewrite to backend
  if (url.startsWith("/uploads/")) return url;
  // Strip any backend host prefix (handles legacy absolute URLs from any environment)
  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/uploads/")) return parsed.pathname;
  } catch {
    // Not a valid URL, return as-is
  }
  return url;
}
