"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, Settings2, X, Check } from "lucide-react";

type ConsentCategory = "necessary" | "functional" | "analytics" | "marketing";

type ConsentState = Record<ConsentCategory, boolean>;

const STORAGE_KEY = "destates_cookie_consent_v1";

const defaultConsent: ConsentState = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

const categories: {
  id: ConsentCategory;
  title: string;
  description: string;
  required?: boolean;
}[] = [
  {
    id: "necessary",
    title: "Strictly Necessary",
    description:
      "Required for core site functionality such as sign-in, cart, KYC, and session security. These cannot be disabled.",
    required: true,
  },
  {
    id: "functional",
    title: "Functional",
    description:
      "Remember your preferences like saved filters, recently viewed properties, and language so your experience stays consistent.",
  },
  {
    id: "analytics",
    title: "Analytics",
    description:
      "Help us understand how investors use Destates so we can improve listings, search, and the checkout flow.",
  },
  {
    id: "marketing",
    title: "Marketing",
    description:
      "Used to show relevant investment opportunities and measure the performance of our campaigns across platforms.",
  },
];

function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { consent: ConsentState };
    return { ...defaultConsent, ...parsed.consent, necessary: true };
  } catch {
    return null;
  }
}

function writeConsent(consent: ConsentState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ consent, timestamp: new Date().toISOString(), version: 1 })
  );
  window.dispatchEvent(new CustomEvent("destates:consent-updated", { detail: consent }));
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(defaultConsent);

  useEffect(() => {
    const existing = readConsent();
    if (!existing) {
      setVisible(true);
    } else {
      setConsent(existing);
    }
    const openHandler = () => {
      setConsent(readConsent() ?? defaultConsent);
      setShowPrefs(true);
      setVisible(true);
    };
    window.addEventListener("destates:open-cookie-settings", openHandler);
    return () => window.removeEventListener("destates:open-cookie-settings", openHandler);
  }, []);

  const save = (next: ConsentState) => {
    const final = { ...next, necessary: true };
    writeConsent(final);
    setConsent(final);
    setVisible(false);
    setShowPrefs(false);
  };

  const acceptAll = () =>
    save({ necessary: true, functional: true, analytics: true, marketing: true });
  const rejectAll = () =>
    save({ necessary: true, functional: false, analytics: false, marketing: false });

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 220 }}
          className="fixed bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 z-[60] sm:max-w-sm"
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
        >
          <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
            {!showPrefs ? (
              <div className="p-4">
                <div className="flex items-start gap-2.5 mb-3">
                  <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center">
                    <Cookie size={16} />
                  </div>
                  <div className="text-xs">
                    <h3 className="font-semibold text-foreground text-sm mb-0.5">We value your privacy</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We use cookies to improve your experience. See our{" "}
                      <Link href="/cookie-policy" className="text-primary underline underline-offset-2">
                        Cookie Policy
                      </Link>
                      .
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={acceptAll}
                    className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    Accept all
                  </button>
                  <button
                    onClick={rejectAll}
                    className="flex-1 px-3 py-2 text-xs font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setShowPrefs(true)}
                    aria-label="Customize"
                    className="p-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    <Settings2 size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary inline-flex items-center justify-center">
                      <Settings2 size={16} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">Cookie preferences</h3>
                      <p className="text-[11px] text-muted-foreground">
                        Choose categories below.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPrefs(false)}
                    aria-label="Close preferences"
                    className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const checked = consent[cat.id];
                    return (
                      <div
                        key={cat.id}
                        className="flex items-start justify-between gap-3 p-2.5 rounded-lg border border-border bg-background/40"
                      >
                        <div className="text-xs">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <h4 className="font-semibold text-foreground">{cat.title}</h4>
                            {cat.required && (
                              <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                On
                              </span>
                            )}
                          </div>
                          <p className="text-muted-foreground leading-snug">{cat.description}</p>
                        </div>
                        <label
                          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                            checked ? "bg-primary" : "bg-muted"
                          } ${cat.required ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            disabled={cat.required}
                            onChange={(e) =>
                              setConsent((c) => ({ ...c, [cat.id]: e.target.checked }))
                            }
                          />
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-background shadow transition-transform ${
                              checked ? "translate-x-4" : "translate-x-0.5"
                            }`}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => save(consent)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Check size={14} /> Save
                  </button>
                  <button
                    onClick={acceptAll}
                    className="flex-1 px-3 py-2 text-xs font-medium rounded-lg border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    Accept all
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("destates:open-cookie-settings"));
}
