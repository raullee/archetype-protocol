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
const GA_ID = (process.env.NEXT_PUBLIC_GA_ID || "G-M8VKQ3H7R2").trim();

type Attribution = {
  ref?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
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
    ref: params.get("ref")?.trim().toLowerCase() || undefined,
    utm_source: params.get("utm_source")?.trim().toLowerCase() || undefined,
    utm_medium: params.get("utm_medium")?.trim().toLowerCase() || undefined,
    utm_campaign: params.get("utm_campaign")?.trim().toLowerCase() || undefined,
    utm_content: params.get("utm_content")?.trim().toLowerCase() || undefined,
    utm_term: params.get("utm_term")?.trim().toLowerCase() || undefined,
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
    captureAttribution();
    // Auto-attach attribution + capture cross-site funnel origin.
    window.gtag(eventType, name, { site_slug: "archetype", ...params, ...getAttribution() });
  }
}

const getGaField = (field: "client_id" | "session_id"): Promise<string | undefined> =>
  new Promise((resolve) => {
    if (typeof window === "undefined" || typeof window.gtag !== "function") return resolve(undefined);
    let settled = false;
    const finish = (value?: unknown) => {
      if (settled) return;
      settled = true;
      resolve(typeof value === "string" || typeof value === "number" ? String(value) : undefined);
    };
    window.gtag("get", GA_ID, field, finish);
    window.setTimeout(() => finish(), 400);
  });

export async function checkoutAttribution(): Promise<Record<string, string>> {
  captureAttribution();
  const [clientId, sessionId] = await Promise.all([getGaField("client_id"), getGaField("session_id")]);
  const campaign = Object.fromEntries(
    Object.entries(getAttribution()).filter((entry): entry is [string, string] => typeof entry[1] === "string")
  );
  return {
    ...(clientId ? { ga_client_id: clientId } : {}),
    ...(sessionId ? { ga_session_id: sessionId } : {}),
    ...campaign,
  };
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

export function trackPaymentClick(tier: string, price: string, archetype: string, currency: string = "usd") {
  const priceNum = parseFloat(price);
  const eventParams = {
    event_category: "Revenue",
    event_label: tier,
    value: priceNum,
    currency: currency.toUpperCase(),
    offer_id: `archetype_${tier}`,
    tier,
    archetype,
    items: [{ item_id: `archetype_${tier}`, item_name: "Archetype Protocol Report", price: priceNum, quantity: 1 }],
  };
  gtag("event", "payment_click", eventParams);
  gtag("event", "begin_checkout", eventParams);
  trackPixelInitiateCheckout(tier, priceNum, archetype);
}

/**
 * Tier → fallback price, per currency. Currency MUST be reported accurately: GA4
 * converts `value` using the declared `currency`, so labelling a RM 95 sale as
 * USD would inflate reported revenue roughly fourfold.
 */
const TIER_PRICES: Record<string, Record<string, number>> = {
  usd: { basic: 18.99, full: 28.99 },
  myr: { basic: 39.9, full: 95 },
};

export function trackPaymentSuccess(
  tier: string,
  archetype: string,
  sessionId?: string,
  amount?: number,
  currency: string = "usd",
) {
  const cur = currency.toLowerCase();
  const value = amount ?? TIER_PRICES[cur]?.[tier] ?? TIER_PRICES.usd.full;
  gtag("event", "purchase", {
    event_category: "Revenue",
    event_label: tier,
    tier,
    archetype,
    value,
    currency: cur.toUpperCase(),
    transaction_id: sessionId,
    offer_id: `archetype_${tier}`,
    items: [{ item_id: `archetype_${tier}`, item_name: "Archetype Protocol Report", price: value, quantity: 1 }],
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
