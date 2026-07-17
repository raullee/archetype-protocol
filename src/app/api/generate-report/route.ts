import { NextRequest, NextResponse } from 'next/server';
import { generateReportPrompt, ResonanceEntry } from '@/lib/report-prompts';
import { Archetype, ARCHETYPE_DATA } from '@/lib/archetypes';

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
  prompt: string
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
      if (text && text.trim().length > 200) return { text, model: name };
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
    // Optional 12-way resonance profile from the results page. When present the
    // report is personalised to the reader's full spectrum, not just their top 2.
    const profile = (requestData as { profile?: ResonanceEntry[] }).profile;

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

    // Generate the prompt
    const prompt = generateReportPrompt(tier, primary as Archetype, secondary as Archetype, profile);

    // Try the tier's model chain; real models first, mock only if all fail.
    const { text: rawText, model: usedModel } = await generateWithFallback(
      MODEL_CHAIN[tier] ?? ['google/gemini-2.5-flash'],
      prompt
    );
    console.log(`[archetype][gen] ${tier} report via ${usedModel}`);

    const generatedText = sanitizeReportText(rawText);

    // Parse the generated content into sections
    const sections = parseReportSections(generatedText, tier);
    
    // Create the report object
    const report: GeneratedReport = {
      tier,
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
  
  // Split by ## headers
  const parts = generatedText.split(/^## /m).filter(part => part.trim().length > 0);
  
  parts.forEach(part => {
    const lines = part.trim().split('\n');
    const title = lines[0].replace(/^#+\s*/, '').trim();
    
    if (!title) return;
    
    // Extract content (everything after the title)
    const content = lines.slice(1).join('\n').trim();
    
    // Extract pull quote (look for emphasized text or quotes)
    const pullQuoteMatch = content.match(/"([^"]{50,150})"/);
    const pullQuote = pullQuoteMatch ? pullQuoteMatch[1] : undefined;
    
    sections.push({
      title,
      content,
      pullQuote
    });
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
  // Health check. `?live=1` actually round-trips a tiny generation through
  // OpenRouter so a broken/expired key surfaces here instead of silently
  // degrading to the mock (the exact failure that hid the last outage). The
  // bare check only reports whether a key string is present.
  const configured = !!OPENROUTER_KEY;
  const live = request.nextUrl.searchParams.get('live') === '1';

  if (!live) {
    return NextResponse.json({ status: 'ok', configured, provider: 'openrouter' });
  }

  try {
    const { model } = await generateWithFallback(
      ['google/gemini-2.5-flash'],
      'Reply with the single word: ok'
    );
    return NextResponse.json({ status: 'ok', configured, provider: 'openrouter', reachable: true, model });
  } catch (e) {
    return NextResponse.json(
      { status: 'degraded', configured, provider: 'openrouter', reachable: false, error: e instanceof Error ? e.message : String(e) },
      { status: 503 }
    );
  }
}