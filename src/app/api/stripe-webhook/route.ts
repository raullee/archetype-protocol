import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();

export async function POST(request: NextRequest) {
  if (!stripeSecretKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeSecretKey);
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("[archetype] checkout.session.completed", {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email,
        archetypes: session.metadata?.archetypes,
        tier: session.metadata?.tier,
        payment_status: session.payment_status,
      });
      // Fire Meta CAPI Purchase event server-side. Deduplicates with client-side
      // trackPaymentSuccess via shared event_id = `purchase-<session.id>`.
      const capiToken = process.env.META_CAPI_ACCESS_TOKEN?.trim();
      const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://archetype.syncprimitive.com";
      if (capiToken && pixelId) {
        const archetypes = (session.metadata?.archetypes || "").split(",");
        const primary = archetypes[0] || "Unknown";
        const value = (session.amount_total || 0) / 100;
        // Fire-and-forget; do not block webhook ACK on Meta's response.
        void fetch(`${siteUrl}/api/meta-capi`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: "Purchase",
            eventId: `purchase-${session.id}`,
            userEmail: session.customer_details?.email,
            customData: {
              value,
              currency: session.currency?.toUpperCase() || "USD",
              content_name: `archetype_${session.metadata?.tier || "unknown"}`,
              content_category: primary,
              content_type: "product",
            },
            eventSourceUrl: `${siteUrl}/success?session_id=${session.id}`,
          }),
        }).catch((e) => console.error("[archetype][capi-purchase]", e));
      }
      break;
    }
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[archetype] ${event.type}`, { id: session.id, tier: session.metadata?.tier });
      break;
    }
    default:
      console.log(`[archetype] unhandled event: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
