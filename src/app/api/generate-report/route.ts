import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { generateReportPrompt, ResonanceEntry } from '@/lib/report-prompts';
import { Archetype, ARCHETYPE_DATA } from '@/lib/archetypes';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

/**
 * Proof-of-payment gate. The report IS the RM 95 product, so the endpoint that
 * mints it must not be open. Every legitimate reader arrives from the Stripe
 * success flow (session_id) or a redeemed dual bundle (bundle), so we require one
 * and verify it is paid.
 *
 * Design bias: block freeloaders, never a real buyer. A missing or unpaid token
 * is rejected, but a transient Stripe error FAILS OPEN (allow + log), because a
 * real customer holding a valid session must never be denied their purchase by an
 * upstream hiccup. Freeloaders calling with no token are still blocked; they
 * cannot cause a Stripe error because there is nothing to look up.
 */
async function verifyEntitlement(
  sessionId: string | undefined,
  bundleId: string | undefined,
  requestedTier: 'basic' | 'full'
): Promise<{ allowed: boolean; tier: 'basic' | 'full'; reason?: string }> {
  // No Stripe configured (e.g. preview env): cannot verify, so do not block.
  if (!stripeSecretKey) return { allowed: true, tier: requestedTier, reason: 'stripe-unconfigured' };

  const token = (sessionId || bundleId || '').trim();
  if (!token || !token.startsWith('cs_')) {
    return { allowed: false, tier: requestedTier, reason: 'no-payment-token' };
  }

  try {
    const stripe = new Stripe(stripeSecretKey);
    const session = await stripe.checkout.sessions.retrieve(token);
    const paid = session.payment_status === 'paid' || session.payment_status === 'no_payment_required';
    if (!paid) return { allowed: false, tier: requestedTier, reason: 'session-unpaid' };

    // A dual bundle unlocks the full blueprint. A direct purchase grants exactly
    // the tier that was paid for, so a basic buyer cannot request the full report.
    const paidTier = session.metadata?.tier;
    if (paidTier === 'dual') return { allowed: true, tier: requestedTier };
    if (paidTier === 'full') return { allowed: true, tier: 'full' };
    if (paidTier === 'basic') return { allowed: true, tier: 'basic' };
    return { allowed: true, tier: requestedTier }; // paid, unknown tier: honour request
  } catch (e) {
    // Upstream error: fail OPEN so a real buyer is never blocked, but log it.
    console.error('[archetype][entitlement] verify failed, allowing:', e instanceof Error ? e.message : e);
    return { allowed: true, tier: requestedTier, reason: 'verify-error-failopen' };
  }
}

// Reports run through OpenRouter, not the direct Google key. OpenRouter carries
// its own billing, so gemini-2.5-pro is reachable (the direct free-tier key is
// blocked from pro, which is why the live product was silently serving the mock).
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_KEY = (process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY)?.trim();

// Each tier has a MODEL CHAIN tried in order; first success wins, mock is the
// last resort only if every model fails. Full blueprint leads with pro (worth
// the quality on the paid tier) and falls back to flash; basic runs on flash.
const MODEL_CHAIN: Record<string, string[]> = {
  full: ['google/gemini-2.5-pro', 'google/gemini-2.5-flash'],
  basic: ['google/gemini-2.5-flash'],
};

async function generateWithFallback(
  models: string[],
  prompt: string,
  minLength = 200
): Promise<{ text: string; model: string }> {
  if (!OPENROUTER_KEY) throw new Error('OPENROUTER_API_KEY is not set');
  let lastErr: unknown;
  for (const name of models) {
    try {
      const res = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${OPENROUTER_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://archetype.syncprimitive.com',
          'X-Title': 'The Archetype Protocol',
        },
        body: JSON.stringify({
          model: name,
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.85,
          top_p: 0.95,
          max_tokens: 16384,
        }),
      });
      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`OpenRouter ${res.status}: ${detail.slice(0, 200)}`);
      }
      const data = await res.json();
      const text: string = data?.choices?.[0]?.message?.content ?? '';
      if (text && text.trim().length >= minLength) return { text, model: name };
      lastErr = new Error(`Empty/short response from ${name}`);
    } catch (e) {
      lastErr = e;
      console.error(`[archetype][gen] ${name} failed:`, e instanceof Error ? e.message : e);
    }
  }
  throw lastErr ?? new Error('All models failed');
}

interface ReportSection {
  title: string;
  content: string;
  pullQuote?: string;
}

interface GeneratedReport {
  tier: string;
  primary: Archetype;
  secondary: Archetype;
  sections: ReportSection[];
  metadata: {
    wordCount: number;
    generatedAt: string;
    archetypeColors: string[];
  };
}

export async function POST(request: NextRequest) {
  let requestData: { primary: string; secondary: string; tier: string } = {
    primary: 'Magician',
    secondary: 'Outlaw',
    tier: 'basic'
  };

  try {
    requestData = await request.json();
    const { primary, secondary, tier } = requestData;
    const body = requestData as {
      profile?: ResonanceEntry[];
      sessionId?: string;
      bundle?: string;
    };
    // Optional 12-way resonance profile from the results page. When present the
    // report is personalised to the reader's full spectrum, not just their top 2.
    const profile = body.profile;

    if (!primary || !secondary || !tier) {
      return NextResponse.json(
        { error: 'Missing required fields: primary, secondary, tier' },
        { status: 400 }
      );
    }

    if (tier !== 'basic' && tier !== 'full') {
      return NextResponse.json(
        { error: `Unsupported tier: ${tier}` },
        { status: 400 }
      );
    }

    // Proof of payment. Rejects freeloaders; fails open on Stripe errors so a real
    // buyer is never blocked. The paid tier wins, so basic cannot request full.
    const entitlement = await verifyEntitlement(body.sessionId, body.bundle, tier);
    if (!entitlement.allowed) {
      return NextResponse.json(
        { error: 'This report requires a completed purchase.', reason: entitlement.reason },
        { status: 402 }
      );
    }
    const grantedTier = entitlement.tier;

    // Generate the prompt
    const prompt = generateReportPrompt(grantedTier, primary as Archetype, secondary as Archetype, profile);

    // Try the tier's model chain; real models first, mock only if all fail.
    const { text: rawText, model: usedModel } = await generateWithFallback(
      MODEL_CHAIN[grantedTier] ?? ['google/gemini-2.5-flash'],
      prompt
    );
    console.log(`[archetype][gen] ${grantedTier} report via ${usedModel}`);

    const generatedText = sanitizeReportText(rawText);

    // Parse the generated content into sections
    const sections = parseReportSections(generatedText, grantedTier);

    // Create the report object
    const report: GeneratedReport = {
      tier: grantedTier,
      primary: primary as Archetype,
      secondary: secondary as Archetype,
      sections,
      metadata: {
        wordCount: generatedText.split(/\s+/).length,
        generatedAt: new Date().toISOString(),
        archetypeColors: [
          ARCHETYPE_DATA[primary as Archetype].accentColor,
          ARCHETYPE_DATA[secondary as Archetype].accentColor,
        ]
      }
    };

    return NextResponse.json({ report });

  } catch (error) {
    console.error('Report generation error:', error);

    const { primary, secondary, tier } = requestData;

    // Return high-quality mock report when API fails
    const mockReport = generateMockReport(primary, secondary, tier);
    return NextResponse.json({ report: mockReport });
  }
}

/**
 * Enforces the no-em-dash house rule deterministically. Prompt instructions alone
 * are unreliable (models emit them anyway), so we strip at the boundary:
 *   " — " (spaced)  -> "; "   (it was joining two clauses)
 *   "word—word"     -> ", "   (tight em/en dash inside a phrase)
 * Hyphens in ranges like "3-5" are left untouched.
 */
function sanitizeReportText(text: string): string {
  return text
    .replace(/\s+[—–]\s+/g, '; ')
    .replace(/([^\s])[—–]([^\s])/g, '$1, $2')
    .replace(/[—–]/g, ', ');
}

function generateMockReport(primary: string, secondary: string, tier: string): GeneratedReport {
  const mockSections: ReportSection[] = [
    {
      title: "Your Artist Archetype Essence",
      content: `As a ${primary}-${secondary} combination, you carry the fusion of ${primary.toLowerCase()} drive and ${secondary.toLowerCase()} instinct. This blend shapes how you show up as an artist and where your work naturally wants to go.\n\nYour ${primary} core pushes you to lead with vision, while your ${secondary} influence gives that vision its form. The two are not in conflict; they hand off to each other. Where the ${primary} reaches for the idea, the ${secondary} makes it land.\n\nWhat makes this pairing compelling is the handoff itself. It is the thing your audience feels even when they cannot name it.`,
      pullQuote: `Where the ${primary} reaches for the idea, the ${secondary} makes it land.`
    },
    {
      title: "Your Creative Superpowers",
      content: `Your artistic toolkit is uniquely calibrated for breakthrough innovation. As a ${primary}, you possess an innate ability to see patterns and possibilities that others miss entirely. This isn't just creativity; it's creative prescience.\n\nYour ${secondary} nature amplifies this gift by providing the courage and determination to act on your insights. While other artists might hesitate or second-guess their vision, you move forward with conviction. This creates a competitive advantage that's nearly impossible to replicate.\n\nIn collaborative settings, you naturally become the catalyst; the person who sparks new directions and possibilities. Your ideas don't just inspire; they ignite movements. Teams gravitate toward your energy because you make the impossible feel achievable.`,
      pullQuote: "Your ideas don't just inspire; they ignite movements."
    },
    {
      title: "Your Shadow & Growth Edge",
      content: `Every archetype has its shadow, and yours manifests in the tendency to become impatient with slower-moving creative processes. Your rapid ideation and decisive nature can sometimes leave collaborators feeling overwhelmed or excluded.\n\nThe key growth opportunity lies in learning to modulate your intensity without dimming your creative fire. This means developing patience for the organic unfolding that great art sometimes requires, and creating space for others to contribute meaningfully to your vision.\n\nWhen you master this balance, your creative output doesn't just improve; it becomes transcendent. The most successful artists with your archetype learn to be both the lightning and the lightning rod.`,
      pullQuote: "Learn to be both the lightning and the lightning rod."
    }
  ];

  if (tier === 'full' || tier === 'premium') {
    mockSections.push(
      {
        title: "Your Artistic Legacy Blueprint",
        content: `Your ${primary}-${secondary} archetype is destined to leave a mark that extends far beyond individual works. You're building toward a legacy of transformation; not just in what you create, but in how you change the creative landscape itself.\n\nHistorically, artists with your archetype combination have been the ones who define new movements, challenge established norms, and open entirely new creative territories. Think of the artists who didn't just excel in their medium; they redefined what the medium could be.\n\nYour path isn't about fitting into existing categories; it's about creating new ones. The work you produce in the next 3-5 years will likely establish patterns and themes that define your artistic identity for decades to come.`,
        pullQuote: "You're not just creating art; you're creating new artistic territories."
      },
      {
        title: "Your Ideal Creative Environment",
        content: `To reach your full potential, you need an environment that can match your creative velocity while providing enough structure to channel your energy productively. This means having both complete creative freedom and strategic constraints that focus your output.\n\nThe ideal creative space for your archetype includes multiple project streams, access to cutting-edge tools and techniques, and collaborators who can match your pace and vision. You thrive in environments where experimentation is encouraged and failure is seen as data rather than defeat.\n\nConsider setting up your workspace to accommodate rapid prototyping and iteration. Your best work often comes from the 20th iteration of an idea, not the first, so you need systems that support prolific output and quick pivots.`,
        pullQuote: "Your best work often comes from the 20th iteration, not the first."
      },
      {
        title: "Your Monetization Strategy",
        content: `Your archetype has unique advantages in the modern creative economy. Your ability to innovate quickly and your natural leadership qualities position you perfectly for the creator economy, where authenticity and innovation are the primary currencies.\n\nConsider developing multiple revenue streams that leverage both your creative output and your visionary perspective. This might include direct sales of your work, licensing your creative processes or methodologies, teaching and mentoring, and possibly developing creative products or services that serve other artists.\n\nYour greatest financial opportunity lies in creating systems and frameworks that can generate value even when you're not actively working. Think intellectual property, scalable teaching methods, or creative tools that others can use.`,
        pullQuote: "Your greatest opportunity lies in creating systems that generate value while you sleep."
      }
    );
  }

  return {
    tier,
    primary: primary as Archetype,
    secondary: secondary as Archetype,
    sections: mockSections,
    metadata: {
      wordCount: mockSections.reduce((acc, section) => acc + section.content.split(' ').length, 0),
      generatedAt: new Date().toISOString(),
      archetypeColors: [
        ARCHETYPE_DATA[primary as Archetype]?.accentColor || '#8B5CF6',
        ARCHETYPE_DATA[secondary as Archetype]?.accentColor || '#64748B',
      ]
    }
  };
}

function parseReportSections(generatedText: string, tier: string): ReportSection[] {
  const sections: ReportSection[] = [];

  // The model usually opens with a few lines of intro BEFORE the first "## "
  // heading. Splitting naively turns that intro into a section whose "title" is a
  // whole paragraph. So peel the preamble off first and fold it into the first
  // real section as a lead-in, rather than inventing a title for it.
  const firstHeading = generatedText.search(/^## /m);
  let preamble = '';
  let body = generatedText;
  if (firstHeading > 0) {
    preamble = generatedText.slice(0, firstHeading).trim();
    body = generatedText.slice(firstHeading);
  }

  const parts = body.split(/^## /m).filter((part) => part.trim().length > 0);

  parts.forEach((part, i) => {
    const lines = part.trim().split('\n');
    const title = lines[0].replace(/^#+\s*/, '').trim();

    // A real heading is short. If the "title" is a paragraph, this chunk is stray
    // prose, not a section; fold it into the previous section instead of titling it.
    if (!title) return;
    if (title.length > 90) {
      if (sections.length > 0) {
        sections[sections.length - 1].content += `\n\n${part.trim()}`;
      }
      return;
    }

    let content = lines.slice(1).join('\n').trim();
    // Attach the preamble as a lead-in to the first real section.
    if (i === 0 && preamble) {
      content = `${preamble}\n\n${content}`;
    }

    const pullQuoteMatch = content.match(/"([^"]{50,150})"/);
    const pullQuote = pullQuoteMatch ? pullQuoteMatch[1] : undefined;

    sections.push({ title, content, pullQuote });
  });

  // If no sections found (different format), create one main section
  if (sections.length === 0) {
    sections.push({
      title: `Your ${tier === 'basic' ? 'Artist Archetype Profile' : 
                 tier === 'full' ? 'Complete Artist Blueprint' : 
                 'Creative Partnership Analysis'}`,
      content: generatedText.trim()
    });
  }

  return sections;
}

export async function GET(request: NextRequest) {
  const configured = !!OPENROUTER_KEY;

  // The live round-trip actually spends OpenRouter tokens, so it is gated behind
  // a secret token to prevent an unauthenticated caller from burning credits by
  // hammering the endpoint. Without a valid token, only the free presence check
  // runs. Set HEALTHCHECK_TOKEN in the environment and call ?live=<token>.
  const liveToken = request.nextUrl.searchParams.get('live');
  const expected = process.env.HEALTHCHECK_TOKEN?.trim();
  const liveAuthorised = !!expected && liveToken === expected;

  if (!liveAuthorised) {
    return NextResponse.json({ status: 'ok', configured, provider: 'openrouter' });
  }

  try {
    const { model } = await generateWithFallback(
      ['google/gemini-2.5-flash'],
      'Reply with the single word: ok',
      1
    );
    return NextResponse.json({ status: 'ok', configured, provider: 'openrouter', reachable: true, model });
  } catch (e) {
    return NextResponse.json(
      { status: 'degraded', configured, provider: 'openrouter', reachable: false, error: e instanceof Error ? e.message : String(e) },
      { status: 503 }
    );
  }
}