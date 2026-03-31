import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PG Details | Destates",
  description: "View detailed information about this PG accommodation including amenities, rent, and contact details.",
};

export default function PGDetailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
