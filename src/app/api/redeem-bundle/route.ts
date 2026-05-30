import { NextResponse } from "next/server";
import Stripe from "stripe";

// Validates a hexaco "dual" Stripe session and unlocks the archetype premium report.
// Single-use for generation (marks metadata.archetype_redeemed_at on first valid redeem),
// idempotent for re-view (subsequent calls return alreadyRedeemed:true so the user can
// recover access if they clear localStorage or switch devices — the email link still works).

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

export async function POST(request: Request) {
  if (!stripeSecretKey) {
    return NextResponse.json(
      { valid: false, error: "Stripe not configured" },
      { status: 503 }
    );
  }

  let sessionId: string | undefined;
  try {
    const body = await request.json();
    sessionId = body.sessionId;
  } catch {
    return NextResponse.json({ valid: false, error: "Invalid JSON body" }, { status: 400 });
  }

  if (!sessionId || !sessionId.startsWith("cs_")) {
    return NextResponse.json({ valid: false, error: "Invalid session ID" }, { status: 400 });
  }

  const stripe = new Stripe(stripeSecretKey);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ valid: false, error: "Session not paid" }, { status: 402 });
    }

    if (session.metadata?.tier !== "dual") {
      return NextResponse.json(
        { valid: false, error: "Not a bundle session" },
        { status: 403 }
      );
    }

    const alreadyRedeemed = !!session.metadata?.archetype_redeemed_at;

    if (!alreadyRedeemed) {
      await stripe.checkout.sessions.update(sessionId, {
        metadata: {
          ...session.metadata,
          archetype_redeemed_at: new Date().toISOString(),
        },
      });
    }

    return NextResponse.json({
      valid: true,
      sessionId,
      alreadyRedeemed,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("redeem-bundle error:", msg);
    return NextResponse.json(
      { valid: false, error: "Verification failed" },
      { status: 500 }
    );
  }
}
