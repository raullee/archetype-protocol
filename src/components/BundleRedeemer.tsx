"use client";

import { useEffect } from "react";

// Detects ?bundle=cs_xxx on any page, validates server-side via /api/redeem-bundle,
// and persists the unlock flag to localStorage. The URL param is cleared after redemption
// so the bundle token doesn't leak via shared links or browser history.
//
// localStorage shape: { sessionId: string, redeemedAt: ISOString } under "ap_bundle_unlock".
// /results inspects this flag to swap the paywall for a Reveal CTA. The /api/generate-report
// endpoint additionally re-verifies the session_id server-side, so localStorage is UX-only.

const STORAGE_KEY = "ap_bundle_unlock";

export function BundleRedeemer() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("bundle");
    if (!sessionId || !sessionId.startsWith("cs_")) return;

    let cancelled = false;

    fetch("/api/redeem-bundle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.valid) {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
              sessionId: data.sessionId,
              redeemedAt: new Date().toISOString(),
            })
          );
        }
      })
      .catch((err) => {
        console.warn("Bundle redeem failed:", err);
      })
      .finally(() => {
        if (cancelled) return;
        // Strip ?bundle= from URL whether redeem succeeded or failed — we don't want
        // a stale token sitting in history or shareable links.
        params.delete("bundle");
        const newSearch = params.toString();
        const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : "") + window.location.hash;
        window.history.replaceState({}, "", newUrl);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
