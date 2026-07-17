import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PRICING, TIER_NAMES, currencyForCountry, isTier } from "@/lib/pricing";
import { resolveCountry } from "@/lib/geo";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

// Pricing depends on the caller's geo, so this must never be cached.
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. STRIPE_SECRET_KEY env var is missing." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const body = await request.json();
    const { archetypes = [], tier = "full" } = body;

    // Server-authoritative pricing. The browser supplies NEITHER amount NOR
    // currency -- both are derived here from the edge geo header, which a client
    // cannot forge. Any price/currency/productName in the body is ignored.
    if (!isTier(tier)) {
      return NextResponse.json({ error: `Unknown tier: ${tier}` }, { status: 400 });
    }

    const country = resolveCountry(request.headers, new URL(request.url));
    const currency = currencyForCountry(country);
    const unitAmount = PRICING[currency][tier];
    const name = TIER_NAMES[tier];

    const primaryArchetype = archetypes[0] || "Unknown";

    const origin = request.headers.get("origin") || "https://archetype.syncprimitive.com";
    const session = await stripe.checkout.sessions.create({
      // Omit payment_method_types so Stripe Checkout adaptively enables Card + Apple Pay + Google Pay + Link.
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name,
              description: `Your complete ${primaryArchetype} archetype analysis`,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?archetypes=${archetypes.join(",")}&tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/results?a=${archetypes.join(",")}`,
      metadata: {
        archetypes: archetypes.join(","),
        tier,
        country: country || "unknown",
        pricing_currency: currency,
      },
      customer_creation: "if_required",
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Checkout error:", msg);
    return NextResponse.json(
      { error: "Failed to create checkout session", detail: msg },
      { status: 500 }
    );
  }
}
