"use client";

import { motion } from "framer-motion";
import { Shield, FileText, AlertTriangle, Lock } from "lucide-react";

const sections = [
  {
    id: "terms",
    icon: FileText,
    title: "Terms & Conditions",
    content: [
      {
        heading: "Platform Usage",
        text: "Destates operates as a marketplace for commercial and residential investment properties. By using our platform, you agree to abide by all applicable laws and regulations governing real estate transactions in India.",
      },
      {
        heading: "Property Listings & Information",
        text: "All property listings are verified and RERA-registered where applicable. Property details including pricing, expected ROI, area, and availability are provided based on the latest information from property developers and owners. Destates reserves the right to update listing information at any time.",
      },
      {
        heading: "Investment & Purchase Terms",
        text: "All property investments are subject to applicable agreements between the buyer and the property owner or developer. Destates facilitates the transaction process including agreement preparation, company approvals, and transfer documentation. The platform handles end-to-end backend processing from agreement initiation to ownership transfer.",
      },
      {
        heading: "Property Transfer Process",
        text: "When a property is transferred from the current owner (Seller) to a new buyer (Buyer), Destates manages the complete backend process including instant mail notifications, company approvals, agreement start dates, and all documentation as per purchase details. Transfer timelines are subject to regulatory and company approval processes.",
      },
      {
        heading: "Lease Agreements",
        text: "Properties listed with lease contracts (such as 9-year or 15-year dry leases) are subject to the terms agreed upon between the property developer and the tenant brand. Rental income projections are based on existing lease agreements and are subject to market conditions.",
      },
      {
        heading: "Filters & Services",
        text: "Properties can be filtered by type, location, price range, expected ROI, and lease duration. Services mentioned in individual listings are specific to that property and may vary. Always review the complete property details and associated terms before making an investment decision.",
      },
      {
        heading: "Cancellation & Refund",
        text: "Cancellation and refund policies are governed by the specific agreement signed between the buyer and the seller/developer. Destates will assist in processing any applicable refunds as per the agreed terms.",
      },
    ],
  },
  {
    id: "property-rules",
    icon: Shield,
    title: "Property Rules & Regulations",
    content: [
      {
        heading: "Ownership Documentation",
        text: "All properties come with complete legal ownership documentation. Buyers will receive sale deeds, possession letters, and all relevant certificates as per RERA and local authority requirements.",
      },
      {
        heading: "Commercial Property Guidelines",
        text: "Ultra-luxury shops, office spaces, and studio apartments listed on the platform are subject to the commercial property guidelines of the respective developer (e.g., M3M). Usage must comply with the sanctioned plan and local commercial zoning regulations.",
      },
      {
        heading: "Rental Income & Lease Compliance",
        text: "Investors receiving rental income through dry lease agreements must comply with applicable tax regulations. Lease terms, rental escalation clauses, and renewal conditions are as specified in the individual property lease agreement.",
      },
      {
        heading: "Maintenance & Upkeep",
        text: "Property maintenance charges, if applicable, are the responsibility of the property owner as per the maintenance agreement with the developer or property management company.",
      },
    ],
  },
  {
    id: "insurance",
    icon: Lock,
    title: "Optional Insurance Coverage",
    content: [
      {
        heading: "Property Insurance",
        text: "Destates offers an optional insurance feature to protect your investment against damage, natural calamities, or other unforeseen issues. This is an additional service available at a monthly premium.",
      },
      {
        heading: "Coverage Details",
        text: "Insurance premiums range from \u20b92,000 to \u20b95,000 per month depending on the property type and value. Coverage includes structural damage, fire, flooding, and other covered perils as defined in the insurance policy.",
      },
      {
        heading: "How to Opt In",
        text: "Insurance can be selected during the property purchase process or added later through your investor dashboard. Coverage begins from the date of activation and is billed monthly along with any applicable management fees.",
      },
    ],
  },
  {
    id: "privacy",
    icon: Lock,
    title: "Privacy Policy",
    content: [
      {
        heading: "Data Collection",
        text: "We collect personal information including name, email, phone number, and identity documents necessary for property transactions and KYC compliance.",
      },
      {
        heading: "Data Usage",
        text: "Your data is used solely for facilitating property transactions, communicating investment updates, and improving our platform services. We do not sell your personal information to third parties.",
      },
      {
        heading: "Data Security",
        text: "All personal and financial data is encrypted and stored securely. We employ industry-standard security measures to protect your information.",
      },
    ],
  },
  {
    id: "disclaimer",
    icon: AlertTriangle,
    title: "Disclaimer",
    content: [
      {
        heading: "Investment Risks",
        text: "Real estate investments are subject to market risks. Past performance and projected returns are not guarantees of future results. Investors should conduct their own due diligence before making investment decisions.",
      },
      {
        heading: "Third-Party Information",
        text: "While Destates verifies property information to the best of its ability, details provided by developers and property owners are their responsibility. Destates acts as a marketplace facilitator and is not liable for discrepancies in third-party information.",
      },
      {
        heading: "Regulatory Compliance",
        text: "All transactions facilitated through Destates comply with applicable RERA regulations and Indian real estate laws. However, regulatory changes may affect property terms and conditions.",
      },
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Terms, Conditions & Policies
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Please review our terms and conditions carefully before using the Destates platform or making any investment decisions.
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-6 mb-10"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Quick Navigation</h3>
          <div className="flex flex-wrap gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="px-4 py-2 bg-muted/50 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {section.title}
              </a>
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-10">
          {sections.map((section, i) => (
            <motion.section
              key={section.id}
              id={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * (i + 2) }}
              className="scroll-mt-24"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
                  <section.icon size={20} />
                </div>
                <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
              </div>

              <div className="space-y-6">
                {section.content.map((item) => (
                  <div key={item.heading} className="bg-card rounded-xl border border-border p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.heading}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </motion.section>
          ))}
        </div>

        {/* Last Updated */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          Last updated: March 2026. For questions, contact us at Support@destates.in
        </motion.p>
      </div>
    </div>
  );
}
