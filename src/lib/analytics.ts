/**
 * GA4 Custom Event Tracking for The Archetype Protocol
 *
 * Events tracked:
 *   quiz_start          – user begins the quiz
 *   quiz_complete       – user finishes all questions (includes archetype + time)
 *   archetype_result_view – result page fully reveals the archetype
 *   payment_click       – user clicks a checkout / unlock button
 *   share_result        – user clicks any share button (twitter, whatsapp, copy link)
 *   cta_click           – user clicks a prominent CTA (hero, nav, footer, etc.)
 *   report_download     – user downloads their PDF report
 *   report_share        – user shares from the report page
 */

// Extend Window so TypeScript knows about gtag
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag(...args);
  }
}

// ── Quiz funnel ─────────────────────────────────────────────────────────

export function trackQuizStart() {
  gtag("event", "quiz_start", {
    event_category: "Engagement",
    event_label: "Archetype Quiz",
  });
}

export function trackQuizComplete(archetype: string, completionSeconds: number) {
  gtag("event", "quiz_complete", {
    event_category: "Conversion",
    event_label: archetype,
    value: completionSeconds,
    archetype_result: archetype,
    completion_time_seconds: completionSeconds,
  });
}

// ── Results page ────────────────────────────────────────────────────────

export function trackArchetypeResultView(primaryArchetype: string, secondaryArchetype: string) {
  gtag("event", "archetype_result_view", {
    event_category: "Content",
    event_label: primaryArchetype,
    primary_archetype: primaryArchetype,
    secondary_archetype: secondaryArchetype,
  });
}

// ── Payment / Paywall ───────────────────────────────────────────────────

export function trackPaymentClick(tier: string, price: string, archetype: string) {
  gtag("event", "payment_click", {
    event_category: "Revenue",
    event_label: tier,
    value: parseFloat(price),
    currency: "USD",
    tier,
    archetype,
  });
}

export function trackPaymentSuccess(tier: string, archetype: string) {
  gtag("event", "purchase", {
    event_category: "Revenue",
    event_label: tier,
    tier,
    archetype,
  });
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
