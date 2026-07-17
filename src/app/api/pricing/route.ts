import { NextRequest, NextResponse } from "next/server";
import { pricingPayload } from "@/lib/pricing";
import { resolveCountry } from "@/lib/geo";

// Geo-dependent responses MUST NOT be cached. Without these two lines Vercel's
// CDN would cache whichever country resolved first and serve it to everyone --
// i.e. hand RM 39.90 to the entire world, or USD to every Malaysian. This is the
// single most common way regional pricing ships broken.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const country = resolveCountry(request.headers, new URL(request.url));
  return NextResponse.json(pricingPayload(country), {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
