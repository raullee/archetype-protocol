import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

/**
 * Meta Conversions API receiver. Receives event payloads from the browser pixel helpers,
 * enriches with server-only signals (IP, fbp/fbc cookies, hashed email), forwards to Graph.
 *
 * Required env:
 *   NEXT_PUBLIC_META_PIXEL_ID      – Pixel ID (same value used by client init)
 *   META_CAPI_ACCESS_TOKEN         – Long-lived CAPI token from Events Manager → Settings → Conversions API
 *   META_TEST_EVENT_CODE           – Optional; set during preview deploys to route into Test Events panel
 */

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim();
const CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN?.trim();
const TEST_CODE = process.env.META_TEST_EVENT_CODE?.trim();
const GRAPH_VERSION = "v21.0";

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value.toLowerCase().trim()).digest("hex");
}

interface CapiBody {
  eventName: string;
  eventId: string;
  customData?: Record<string, unknown>;
  eventSourceUrl?: string;
  userEmail?: string;
}

export async function POST(req: NextRequest) {
  if (!PIXEL_ID || !CAPI_TOKEN) {
    return NextResponse.json(
      { error: "Meta CAPI not configured" },
      { status: 503 }
    );
  }

  let body: CapiBody;
  try {
    body = (await req.json()) as CapiBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { eventName, eventId, customData = {}, eventSourceUrl, userEmail } = body;
  if (!eventName || !eventId) {
    return NextResponse.json({ error: "eventName and eventId are required" }, { status: 400 });
  }

  const ua = req.headers.get("user-agent") || "";
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0]?.trim() || "";
  const cookie = req.headers.get("cookie") || "";
  const fbp = cookie.match(/_fbp=([^;]+)/)?.[1];
  const fbc = cookie.match(/_fbc=([^;]+)/)?.[1];

  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: eventSourceUrl,
    action_source: "website",
    user_data: {
      client_user_agent: ua,
      client_ip_address: ip,
      ...(fbp ? { fbp } : {}),
      ...(fbc ? { fbc } : {}),
      ...(userEmail ? { em: [sha256(userEmail)] } : {}),
    },
    custom_data: customData,
  };

  const payload: Record<string, unknown> = { data: [event] };
  if (TEST_CODE) payload.test_event_code = TEST_CODE;

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${CAPI_TOKEN}`;
  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!r.ok) {
    const detail = await r.text();
    console.error("[meta-capi]", r.status, detail);
    return NextResponse.json({ ok: false, status: r.status }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
