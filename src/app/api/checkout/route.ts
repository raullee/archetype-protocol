import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

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
    const { archetypes = [], tier = "full", price, productName } = body;

    // Default pricing if not provided
    const priceMap: Record<string, number> = { basic: 1299, full: 2499 };
    const nameMap: Record<string, string> = {
      basic: "Basic Artist Archetype Profile",
      full: "Complete Artist Blueprint",
    };

    const unitAmount = price || priceMap[tier] || 1999;
    const name = productName || nameMap[tier] || "Full Archetype Blueprint";

    const primaryArchetype = archetypes[0] || "Unknown";

    const origin = request.headers.get("origin") || "https://archetype.raul.my";
    const session = await stripe.checkout.sessions.create({
      // Omit payment_method_types so Stripe Checkout adaptively enables Card + Apple Pay + Google Pay + Link.
      line_items: [
        {
          price_data: {
            currency: "usd",
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
