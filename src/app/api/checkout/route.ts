import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function POST(request: Request) {
  const { archetypes } = await request.json();

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Artist Archetype - Complete Report",
            description: `Unlock your detailed ${archetypes[0]}/${archetypes[1]} archetype analysis with career strategy and 15-page PDF report`,
          },
          unit_amount: 1900,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${request.headers.get("origin")}/success?archetypes=${archetypes.join(
      ","
    )}`,
    cancel_url: `${request.headers.get("origin")}/results?archetypes=${archetypes.join(
      ","
    )}`,
  });

  return NextResponse.json({ url: session.url });
}
