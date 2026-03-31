import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plot Details | Destates",
  description: "View detailed information about this premium land plot including area, pricing, and amenities.",
};

export default function PlotDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
