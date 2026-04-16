"use client";

import { motion } from "framer-motion";
import { Cookie, ShieldCheck, Settings2, Globe2, Clock, Mail } from "lucide-react";
import { openCookieSettings } from "@/components/layout/CookieConsent";

const sections = [
  {
    id: "what-are-cookies",
    icon: Cookie,
    title: "What Are Cookies?",
    content: [
      {
        heading: "Definition",
        text: "Cookies are small text files placed on your device (computer, tablet, or mobile phone) when you visit a website. They allow the site to recognise your device and remember information about your visit — like your preferences, the pages you viewed, and whether you are signed in.",
      },
      {
        heading: "Similar Technologies",
        text: "In addition to cookies, Destates may use related technologies such as local storage, session storage, pixels, tags, and software development kits (SDKs) on our mobile surfaces. Throughout this policy, the word \u201ccookies\u201d refers to all of these technologies together.",
      },
      {
        heading: "First-Party vs Third-Party",
        text: "First-party cookies are set by Destates and used only on destates.in. Third-party cookies are set by partners such as analytics and advertising providers when you interact with features they supply on our platform.",
      },
    ],
  },
  {
    id: "why-we-use",
    icon: ShieldCheck,
    title: "Why We Use Cookies",
    content: [
      {
        heading: "Keep You Signed In",
        text: "Session and authentication cookies keep you logged into your investor dashboard, maintain the items in your cart, and protect your account from unauthorised access.",
      },
      {
        heading: "Remember Your Preferences",
        text: "Functional cookies remember choices you make — including preferred language, saved filters (type, location, ROI, lease duration), and recently viewed properties or PGs — so the experience stays consistent across visits.",
      },
      {
        heading: "Measure and Improve",
        text: "Analytics cookies help us understand how investors discover listings, move through the checkout flow, and interact with the transfer and KYC journeys. We use this to improve the platform.",
      },
      {
        heading: "Relevant Opportunities",
        text: "Marketing cookies, where you consent, allow us and our partners to show investment opportunities that may interest you on other websites and to measure the performance of those campaigns.",
      },
    ],
  },
  {
    id: "categories",
    icon: Settings2,
    title: "Categories of Cookies We Use",
    content: [
      {
        heading: "Strictly Necessary (Always On)",
        text: "Required for core functionality such as authentication, session security, CSRF protection, KYC verification, cart and checkout, and load balancing. The platform cannot function without these, so they cannot be switched off.",
      },
      {
        heading: "Functional (Optional)",
        text: "Enhance the experience by remembering your settings and recently viewed items. Declining these will not break the site but some convenience features may reset between visits.",
      },
      {
        heading: "Analytics (Optional)",
        text: "Collect aggregated information about page visits, time on page, device type, and user journeys. We use providers such as Google Analytics to process this data in a privacy-safe manner. You can decline these without affecting your ability to invest.",
      },
      {
        heading: "Marketing (Optional)",
        text: "Used to deliver advertising that is more relevant to you, measure ad performance, and limit how often you see the same ad. These may be set by us or our advertising partners.",
      },
    ],
  },
  {
    id: "third-party",
    icon: Globe2,
    title: "Third-Party Cookies & Partners",
    content: [
      {
        heading: "Analytics Providers",
        text: "We may use Google Analytics and similar services to understand how our platform is used. These partners process limited information (such as IP-truncated data and device attributes) under their own privacy policies.",
      },
      {
        heading: "Payment & KYC Providers",
        text: "When you make a purchase, activate optional insurance, or complete KYC, our payment and verification partners may set cookies strictly required to process your transaction securely.",
      },
      {
        heading: "Embedded Content",
        text: "Some pages may embed content from third parties (for example, maps or video). These providers may set their own cookies which are governed by their privacy policies, not this one.",
      },
    ],
  },
  {
    id: "your-choices",
    icon: Settings2,
    title: "Managing Your Choices",
    content: [
      {
        heading: "Cookie Preferences",
        text: "When you first visit Destates, a consent banner lets you Accept all, Reject non-essential, or Customize your choices per category. Your decision is stored on your device and applies to future visits on the same browser.",
      },
      {
        heading: "Changing Your Mind",
        text: "You can review or change your preferences at any time by clicking \u201cCookie Settings\u201d in the footer, or by using the button below.",
      },
      {
        heading: "Browser Controls",
        text: "Most browsers let you block or delete cookies from their settings menu. Blocking strictly necessary cookies may prevent you from signing in, completing purchases, or using core features of Destates.",
      },
      {
        heading: "Do Not Track",
        text: "Some browsers send a \u201cDo Not Track\u201d signal. Because there is no common industry standard for how it should be honoured, Destates does not currently respond to DNT signals but provides equivalent control through the cookie banner.",
      },
    ],
  },
  {
    id: "retention",
    icon: Clock,
    title: "How Long Cookies Last",
    content: [
      {
        heading: "Session Cookies",
        text: "Deleted automatically when you close your browser. Used mainly for sign-in state and cart persistence during a single visit.",
      },
      {
        heading: "Persistent Cookies",
        text: "Remain on your device for a fixed period (typically from 30 days up to 13 months) so we can remember your preferences and analytics context across visits. You can clear them at any time from your browser.",
      },
      {
        heading: "Consent Record",
        text: "Your cookie choice itself is stored as a small record on your device for up to 12 months, after which we will ask for your preferences again.",
      },
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
            <Cookie size={26} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Cookie Policy
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            This policy explains how Destates uses cookies and similar technologies, what choices
            you have, and how to manage them on your device.
          </p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-6 mb-10"
        >
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Navigation
          </h3>
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

        {/* Manage CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-10 flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between"
        >
          <div>
            <h3 className="font-semibold text-foreground mb-1">Manage your cookie preferences</h3>
            <p className="text-sm text-muted-foreground">
              Update your choice for Functional, Analytics, and Marketing cookies at any time.
            </p>
          </div>
          <button
            onClick={openCookieSettings}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Settings2 size={16} /> Open Cookie Settings
          </button>
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

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-card rounded-xl border border-border p-6 mt-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary">
              <Mail size={20} />
            </div>
            <h2 className="text-xl font-bold text-foreground">Questions?</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For any questions about this Cookie Policy or how we handle your data, write to us at{" "}
            <a href="mailto:Support@destates.in" className="text-primary underline underline-offset-2">
              Support@destates.in
            </a>
            . You can also review our{" "}
            <a href="/terms#privacy" className="text-primary underline underline-offset-2">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/terms" className="text-primary underline underline-offset-2">
              Terms & Conditions
            </a>
            .
          </p>
        </motion.div>

        {/* Last Updated */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center text-sm text-muted-foreground mt-10"
        >
          Last updated: April 2026.
        </motion.p>
      </div>
    </div>
  );
}
