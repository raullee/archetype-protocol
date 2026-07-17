import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

export const dynamic = "force-dynamic";

/**
 * Returns what a checkout session ACTUALLY charged, so the success page can
 * report real revenue instead of a hardcoded tier price.
 *
 * Without this, a sale made with a 50% referral code (SLEEPYROOBS50) reports at
 * full price in GA4 -- which would overstate revenue precisely on the sales we
 * most want to measure. `amount_total` is post-discount and post-geo, so it is
 * the only honest number.
 *
 * Session IDs are unguessable and this returns no PII -- just the amount, the
 * currency, and whether a discount was applied.
 */
export async function GET(request: NextRequest) {
  if (!stripeSecretKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const sessionId = request.nextUrl.searchParams.get("session_id");
  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ error: "Invalid session_id" }, { status: 400 });
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json(
      {
        amount: (session.amount_total ?? 0) / 100,
        currency: session.currency ?? "usd",
        tier: session.metadata?.tier ?? "full",
        discountApplied: (session.total_details?.amount_discount ?? 0) > 0,
        paid: session.payment_status === "paid",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[archetype][session-summary]", msg);
    return NextResponse.json({ error: "Could not retrieve session" }, { status: 404 });
  }
}
