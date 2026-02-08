import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe("sk_test_PLACEHOLDER", {
  apiVersion: "2026-01-28.clover",
});

export async function POST(request: NextRequest) {
  try {
    const { archetypes } = await request.json();

    if (!archetypes || !Array.isArray(archetypes)) {
      return NextResponse.json({ error: "Invalid archetypes data" }, { status: 400 });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Musician Archetype Report",
              description: "Complete archetype analysis with revenue roadmap and personalized strategies",
            },
            unit_amount: 999, // $9.99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.nextUrl.origin}/premium-results?session_id={CHECKOUT_SESSION_ID}&archetypes=${archetypes.join(",")}`,
      cancel_url: `${request.nextUrl.origin}/results?archetypes=${archetypes.join(",")}`,
      metadata: {
        archetypes: archetypes.join(","),
      },
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}