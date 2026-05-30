/**
 * GA4 Custom Event Tracking for The Archetype Protocol.
 *
 * Each conversion-relevant GA event also fires the corresponding Meta Pixel + CAPI event
 * (see ./meta-pixel.ts) so paid Meta campaigns can optimize off the same funnel signals.
 *
 * Events tracked:
 *   quiz_start          – user begins the quiz                  → Pixel Lead
 *   quiz_complete       – user finishes all questions            → Pixel CompleteRegistration
 *   archetype_result_view – result page fully reveals            → Pixel ViewContent
 *   payment_click       – user clicks a checkout / unlock button → Pixel InitiateCheckout
 *   purchase            – Stripe checkout success                → Pixel Purchase (dedupes with server-side Stripe webhook fire)
 *   share_result        – share button click
 *   cta_click           – prominent CTA click
 *   report_download     – PDF download
 *   report_share        – share from the report page
 */
import {
  trackPixelLead,
  trackPixelQuizComplete,
  trackPixelViewContent,
  trackPixelInitiateCheckout,
  trackPixelPurchase,
} from "./meta-pixel";

// Extend Window so TypeScript knows about gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const ATTRIBUTION_KEY = "archetype_attribution";

type Attribution = {
  ref?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  landing_path?: string;
  first_seen?: number;
};

/** Persist first-touch attribution from URL params for the session.
    Call once on app mount. Auto-attached to every event. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(ATTRIBUTION_KEY)) return;
  const params = new URLSearchParams(window.location.search);
  const attr: Attribution = {
    ref: params.get("ref") || undefined,
    utm_source: params.get("utm_source") || undefined,
    utm_medium: params.get("utm_medium") || undefined,
    utm_campaign: params.get("utm_campaign") || undefined,
    utm_content: params.get("utm_content") || undefined,
    landing_path: window.location.pathname,
    first_seen: Date.now(),
  };
  if (attr.ref || attr.utm_source) {
    sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attr));
  }
}

function getAttribution(): Partial<Attribution> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "{}");
  } catch {
    return {};
  }
}

function gtag(eventType: string, name: string, params: Record<string, unknown> = {}) {
  if (typeof window !== "undefined" && window.gtag) {
    // Auto-attach attribution + capture cross-site funnel origin.
    window.gtag(eventType, name, { ...params, ...getAttribution() });
  }
}

// ── Quiz funnel ─────────────────────────────────────────────────────────

export function trackQuizStart() {
  gtag("event", "quiz_start", {
    event_category: "Engagement",
    event_label: "Archetype Quiz",
  });
  trackPixelLead("archetype_quiz_start");
}

export function trackQuizComplete(archetype: string, completionSeconds: number) {
  gtag("event", "quiz_complete", {
    event_category: "Conversion",
    event_label: archetype,
    value: completionSeconds,
    archetype_result: archetype,
    completion_time_seconds: completionSeconds,
  });
  trackPixelQuizComplete(archetype);
}

// ── Results page ────────────────────────────────────────────────────────

export function trackArchetypeResultView(primaryArchetype: string, secondaryArchetype: string) {
  gtag("event", "archetype_result_view", {
    event_category: "Content",
    event_label: primaryArchetype,
    primary_archetype: primaryArchetype,
    secondary_archetype: secondaryArchetype,
  });
  trackPixelViewContent(primaryArchetype, secondaryArchetype);
}

// ── Payment / Paywall ───────────────────────────────────────────────────

export function trackPaymentClick(tier: string, price: string, archetype: string) {
  const priceNum = parseFloat(price);
  gtag("event", "payment_click", {
    event_category: "Revenue",
    event_label: tier,
    value: priceNum,
    currency: "USD",
    tier,
    archetype,
  });
  trackPixelInitiateCheckout(tier, priceNum, archetype);
}

/** Tier → fallback price in USD. Used when amount isn't passed in. */
const TIER_PRICES: Record<string, number> = { basic: 12.99, full: 24.99 };

export function trackPaymentSuccess(tier: string, archetype: string, sessionId?: string, amountUSD?: number) {
  const value = amountUSD ?? TIER_PRICES[tier] ?? 24.99;
  gtag("event", "purchase", {
    event_category: "Revenue",
    event_label: tier,
    tier,
    archetype,
    value,
    currency: "USD",
    transaction_id: sessionId,
  });
  // Pixel Purchase dedupes against the Stripe-webhook server-side Purchase via shared event_id = `purchase-<sessionId>`.
  if (sessionId) {
    trackPixelPurchase(tier, value, archetype, sessionId);
  }
}

// ── Social sharing ──────────────────────────────────────────────────────

export function trackShareResult(method: "twitter" | "whatsapp" | "copy_link" | "native_share", archetype: string) {
  gtag("event", "share_result", {
    event_category: "Engagement",
    event_label: archetype,
    method,
    content_type: "archetype_result",
    archetype,
  });
}

// ── CTA clicks (landing page, nav, etc.) ────────────────────────────────

export function trackCtaClick(location: string, destination: string) {
  gtag("event", "cta_click", {
    event_category: "Engagement",
    event_label: location,
    cta_location: location,
    cta_destination: destination,
  });
}

// ── Report page ─────────────────────────────────────────────────────────

export function trackReportDownload(archetype: string, tier: string) {
  gtag("event", "report_download", {
    event_category: "Engagement",
    event_label: archetype,
    tier,
    archetype,
  });
}

export function trackReportShare(archetype: string) {
  gtag("event", "report_share", {
    event_category: "Engagement",
    event_label: archetype,
    archetype,
  });
}
