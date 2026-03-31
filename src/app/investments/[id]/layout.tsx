import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Property Details | Destates",
  description: "View detailed information about this premium investment property including ROI, highlights, and location.",
};

export default function PropertyDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
