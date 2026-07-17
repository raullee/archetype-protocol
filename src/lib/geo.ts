/**
 * Resolves the visitor's country for pricing.
 *
 * In production this is Vercel's `x-vercel-ip-country`, which the edge network
 * SETS on every inbound request, overwriting anything the client sent. That is
 * what makes it safe to price from: a browser cannot forge its way to ringgit.
 *
 * There is no edge header when running locally, so dev (and dev only) accepts a
 * `?country=MY` override for testing. Guarded on NODE_ENV so it can never be a
 * production bypass.
 */
export function resolveCountry(headers: Headers, url?: URL): string | null {
  const edge = headers.get("x-vercel-ip-country");
  if (edge) return edge;

  if (process.env.NODE_ENV !== "production" && url) {
    return url.searchParams.get("country");
  }
  return null;
}
