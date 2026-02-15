import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_PLACEHOLDER", {
  apiVersion: "2026-01-28.clover",
});

export async function POST(request: Request) {
  try {
    const { archetypes } = await request.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Full Archetype Blueprint",
              description: `Your complete ${archetypes?.[0] || "Archetype"} analysis — relationships, career, shadow work & growth roadmap`,
            },
            unit_amount: 1999,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.headers.get("origin")}/success?archetypes=${(archetypes || []).join(",")}`,
      cancel_url: `${request.headers.get("origin")}/results?a=${(archetypes || []).join(",")}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
