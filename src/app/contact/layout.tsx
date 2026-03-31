import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Destates",
  description: "Get in touch with Destates for real estate investment inquiries, property details, or any questions.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
