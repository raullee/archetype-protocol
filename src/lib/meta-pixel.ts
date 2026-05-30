/**
 * Meta Pixel + Conversions API (CAPI) dual-tracking helpers for The Archetype Protocol.
 *
 * Every event fires both client-side (Pixel) AND server-side (CAPI) with a shared event_id
 * so Meta deduplicates them. Server-side improves attribution accuracy ~30-50% post-iOS14.
 *
 * Wire-up:
 *   - Pixel JS init lives in src/app/layout.tsx (initialised once per session, fires PageView automatically)
 *   - CAPI receiver lives at src/app/api/meta-capi/route.ts
 *   - Stripe webhook fires server-side Purchase with event_id = `purchase-<session.id>` for cross-channel dedup
 *
 * Tracked events:
 *   ViewContent          – results page reveal
 *   Lead                 – quiz start
 *   CompleteRegistration – quiz complete
 *   InitiateCheckout     – user clicks unlock / payment CTA
 *   Purchase             – Stripe checkout completed (client AND server fire; deduped by event_id)
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

function genEventId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

async function sendCapi(
  eventName: string,
  eventId: string,
  customData: Record<string, unknown> = {}
): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/meta-capi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventName,
        eventId,
        customData,
        eventSourceUrl: window.location.href,
      }),
      keepalive: true,
    });
  } catch {
    // CAPI is best-effort from client. Server-side fires (e.g. Stripe webhook) cover the load-bearing events.
  }
}

/**
 * Fire a Meta event on both Pixel (browser) and CAPI (server). Pass eventIdOverride
 * when the same event must dedupe with a separate server-side fire (e.g. Purchase from Stripe webhook).
 */
export function trackPixelEvent(
  eventName: string,
  customData: Record<string, unknown> = {},
  eventIdOverride?: string
): void {
  const eventId = eventIdOverride ?? genEventId();
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, customData, { eventID: eventId });
  }
  void sendCapi(eventName, eventId, customData);
}

// ── Convenience wrappers matching the existing analytics.ts API ──────────

export const trackPixelLead = (label = "archetype_quiz_start"): void =>
  trackPixelEvent("Lead", { content_name: label });

export const trackPixelQuizComplete = (archetype: string): void =>
  trackPixelEvent("CompleteRegistration", {
    content_name: "archetype_quiz_complete",
    content_category: archetype,
  });

export const trackPixelViewContent = (primary: string, secondary: string): void =>
  trackPixelEvent("ViewContent", {
    content_name: `archetype_${primary}_${secondary}`,
    content_type: "archetype_result",
    content_category: primary,
  });

export const trackPixelInitiateCheckout = (
  tier: string,
  priceUSD: number,
  archetype: string
): void =>
  trackPixelEvent("InitiateCheckout", {
    value: priceUSD,
    currency: "USD",
    content_name: `archetype_${tier}`,
    content_category: archetype,
  });

export const trackPixelPurchase = (
  tier: string,
  priceUSD: number,
  archetype: string,
  sessionId: string
): void =>
  trackPixelEvent(
    "Purchase",
    {
      value: priceUSD,
      currency: "USD",
      content_name: `archetype_${tier}`,
      content_category: archetype,
    },
    `purchase-${sessionId}`
  );
