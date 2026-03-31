import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart | Destates",
  description: "Review your selected investment properties and land plots.",
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
