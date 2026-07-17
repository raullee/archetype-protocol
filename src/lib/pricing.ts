// Geo-aware pricing. Single source of truth for BOTH the displayed price and the
// amount actually charged, so the two can never drift apart.
//
// Malaysia gets local pricing (RM 39.90 / RM 95). Everywhere else gets the global
// tier (USD 18.99 / 28.99), which is benchmarked against the premium personality
// cluster (16Personalities $29). This is third-degree price discrimination: local
// DJs pay local rates without collapsing the international anchor.
//
// SECURITY: currency and amount are derived from Vercel's `x-vercel-ip-country`
// edge header on the SERVER only. Vercel overwrites that header at the edge, so a
// client cannot spoof it. The browser never supplies currency or price -- doing so
// would reintroduce the tampering bug fixed on 2026-07-13, where the client set
// its own `price` and could pay $0.01.

export type Currency = "myr" | "usd";
export type Tier = "basic" | "full";

/** Amounts in minor units (sen for MYR, cents for USD). */
export const PRICING: Record<Currency, Record<Tier, number>> = {
  myr: { basic: 3990, full: 9500 },
  usd: { basic: 1899, full: 2899 },
};

export const TIER_NAMES: Record<Tier, string> = {
  basic: "Basic Artist Archetype Profile",
  full: "Complete Artist Blueprint",
};

export const TIERS: Tier[] = ["basic", "full"];

export function isTier(value: unknown): value is Tier {
  return typeof value === "string" && (TIERS as string[]).includes(value);
}

/** Malaysia -> local ringgit pricing. Everyone else -> global USD tier. */
export function currencyForCountry(country?: string | null): Currency {
  return country?.toUpperCase() === "MY" ? "myr" : "usd";
}

/**
 * "RM 39.90", "RM 95", "$28.99" -- trailing .00 is dropped because RM 95 is the
 * Malaysian retail convention, while charm endings (39.90 / .99) are preserved.
 */
export function formatPrice(currency: Currency, minorUnits: number): string {
  const major = minorUnits / 100;
  const body = major.toFixed(2).replace(/\.00$/, "");
  return currency === "myr" ? `RM ${body}` : `$${body}`;
}

/**
 * The comparison anchor shown above the tiers. Must be in the SAME currency the
 * buyer is quoted in, or the comparison it exists to make simply doesn't land.
 * MY figure reflects typical Malaysian clinical-psychologist session rates
 * (~RM 150-400); the USD figure is the pre-existing US therapy anchor.
 */
export const THERAPY_ANCHOR: Record<Currency, string> = {
  myr: "RM 250/hr therapy session",
  usd: "$200/hr therapy session",
};

/** The shape sent to the browser for display. Never used to compute a charge. */
export type PricingPayload = {
  currency: Currency;
  country: string | null;
  anchor: string;
  tiers: Record<Tier, { minorUnits: number; display: string }>;
};

export function pricingPayload(country?: string | null): PricingPayload {
  const currency = currencyForCountry(country);
  return {
    currency,
    country: country ?? null,
    anchor: THERAPY_ANCHOR[currency],
    tiers: {
      basic: {
        minorUnits: PRICING[currency].basic,
        display: formatPrice(currency, PRICING[currency].basic),
      },
      full: {
        minorUnits: PRICING[currency].full,
        display: formatPrice(currency, PRICING[currency].full),
      },
    },
  };
}
