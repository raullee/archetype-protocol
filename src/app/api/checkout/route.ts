import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
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
            name: "The Archetype Protocol - Full Dossier",
            description: `Primary: ${archetypes[0]}, Secondary: ${archetypes[1]}, Tertiary: ${archetypes[2]}`,
          },
          unit_amount: 2700,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${request.headers.get("origin")}/success`,
    cancel_url: `${request.headers.get("origin")}/results?archetypes=${archetypes.join(
      ","
    )}`,
  });

  return NextResponse.json({ url: session.url });
}
