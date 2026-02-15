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

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2026-01-28.clover",
  });

  try {
    const body = await request.json();
    const { archetypes = [], tier = "full", price, productName } = body;

    // Default pricing if not provided
    const priceMap: Record<string, number> = { basic: 999, full: 1999, couples: 3499 };
    const nameMap: Record<string, string> = {
      basic: "Basic Archetype Report — Text Analysis",
      full: "Full Archetype Blueprint — Text + Audio + PDF",
      couples: "Couples Bundle — 2 Reports + Compatibility Analysis",
    };

    const unitAmount = price || priceMap[tier] || 1999;
    const name = productName || nameMap[tier] || "Full Archetype Blueprint";

    const primaryArchetype = archetypes[0] || "Unknown";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
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
      success_url: `${request.headers.get("origin")}/success?archetypes=${archetypes.join(",")}&tier=${tier}`,
      cancel_url: `${request.headers.get("origin")}/results?a=${archetypes.join(",")}`,
      metadata: {
        archetypes: archetypes.join(","),
        tier,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
