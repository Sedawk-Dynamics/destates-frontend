import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <Image src="/logo.png" alt="Destates" width={140} height={40} className="h-8 w-auto mb-4 brightness-0 invert" />
            <p className="text-background/60 text-sm mb-4">
              Your marketplace for affordable housing and premium commercial investment properties. Hassle-free rental income with long-term lease security.
            </p>
            <div className="space-y-2 text-sm text-background/60">
              <p className="flex items-center gap-2"><Phone size={14} /> +91 98978 80441</p>
              <p className="flex items-center gap-2"><Mail size={14} /> Support@destates.in</p>
              <p className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0" /> DLF Phase 5, Two Horizone, Golf Course Road, Gurgaon, Haryana 122002</p>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-background mb-4">Products</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/investments" className="text-background/60 hover:text-primary transition-colors">Investment Properties</Link></li>
              <li><Link href="/pgs" className="text-background/60 hover:text-primary transition-colors">PG Listings</Link></li>
              <li><Link href="/how-it-works" className="text-background/60 hover:text-primary transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-background mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="text-background/60 hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-background/60 hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/about" className="text-background/60 hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-background mb-4">Legal</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/terms" className="text-background/60 hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/terms#privacy" className="text-background/60 hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms#disclaimer" className="text-background/60 hover:text-primary transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-sm text-background/40">
          <p>&copy; {new Date().getFullYear()} Destates Private Limited. All rights reserved.</p>
          <p className="mt-1">Invest without sorrow</p>
        </div>
      </div>
    </footer>
  );
}
