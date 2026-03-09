import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import LayoutShell from "@/components/layout/LayoutShell";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Destates - Invest Without Sorrow | Premium Real Estate Investment",
  description: "Destates offers structured fractional ownership in premium real estate. Invest in RERA-registered properties, land plots, and PG accommodations with verified returns.",
  icons: {
    icon: "/favicon.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <LayoutShell>{children}</LayoutShell>
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: "var(--card)", color: "var(--card-foreground)", border: "1px solid var(--border)" },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
