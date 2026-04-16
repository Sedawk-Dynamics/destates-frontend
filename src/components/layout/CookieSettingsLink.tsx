"use client";

import { openCookieSettings } from "./CookieConsent";

export default function CookieSettingsLink() {
  return (
    <button
      type="button"
      onClick={openCookieSettings}
      className="text-background/60 hover:text-primary transition-colors text-left cursor-pointer"
    >
      Cookie Settings
    </button>
  );
}
