import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Investments | Destates",
  description: "View your fractional property investments.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
