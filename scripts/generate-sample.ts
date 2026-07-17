/**
 * Generates a REAL full-blueprint sample using the production engine:
 * real scoring -> real resonance profile -> real Gemini 2.5 Pro call.
 * Run: npx tsx scripts/generate-sample.ts
 */
import { readFileSync, writeFileSync } from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { QUESTIONS } from '../src/lib/questions';
import { getTopArchetypes, calculateArchetype } from '../src/utils/calculateArchetype';
import { generateReportPrompt } from '../src/lib/report-prompts';
import { Archetype } from '../src/lib/archetypes';

// Use a working (standard-tier) Gemini key. Prod's own key is invalid, which is
// why the live product silently serves the mock; that gets fixed on redeploy.
const env = readFileSync(process.env.HOME + '/Desktop/VIBECODING/web/matselamat/.env.local', 'utf8');
const key = env.match(/^GEMINI_API_KEY="?([^"\n]+)"?/m)?.[1];
if (!key) throw new Error('GEMINI_API_KEY not found');

const MODEL = process.env.SAMPLE_MODEL || 'gemini-2.5-flash';

// A realistic DJ / electronic-producer answer path (one option per question).
// Chosen to lead Magician with an Outlaw/Creator/Explorer tail: the classic
// "make the room feel something, break the format" club-artist shape.
const PICKS: Archetype[] = [
  'Magician',  // Q1 drive: making people feel truly alive
  'Outlaw',    // Q2 crisis: challenge whoever caused the problem
  'Magician',  // Q3 compliment: you changed my perspective entirely
  'Creator',   // Q4 weekend: deep in a creative project
  'Magician',  // Q5 group: the big, wild idea
  'Explorer',  // Q6 frustration: closed-mindedness and dogma
  'Magician',  // Q7 people need: inspiration, a new way of seeing
  'Outlaw',    // Q8 fear: being trapped in someone else's system
];

// Sanity: each pick must be offered on its question.
PICKS.forEach((p, i) => {
  const offered = QUESTIONS[i].options.map((o) => o.archetype);
  if (!offered.includes(p)) {
    throw new Error(`Q${i + 1} does not offer ${p}; offers ${offered.join(', ')}`);
  }
});

const ranked = calculateArchetype(PICKS);
const top = getTopArchetypes(PICKS);
const profile = ranked.map((r) => ({ archetype: r.archetype, percentage: r.percentage }));

console.log('Resonance profile:');
profile.forEach((p) => console.log(`  ${p.archetype.padEnd(10)} ${p.percentage}%`));
console.log(`\nPrimary: ${top.primary.archetype}  Secondary: ${top.secondary.archetype}`);
console.log(`\nCalling ${MODEL} (full blueprint)...\n`);

const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({
  model: MODEL,
  generationConfig: { temperature: 0.85, topK: 40, topP: 0.95, maxOutputTokens: 16384 },
});

const prompt = generateReportPrompt('full', top.primary.archetype, top.secondary.archetype, profile);

async function main() {
  const t0 = Date.now();
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const secs = ((Date.now() - t0) / 1000).toFixed(1);

  const words = text.split(/\s+/).filter(Boolean).length;
  const header = `# SAMPLE FULL BLUEPRINT (${MODEL})

Primary: ${top.primary.archetype} / Secondary: ${top.secondary.archetype}
Profile: ${profile.map((p) => `${p.archetype} ${p.percentage}%`).join(' · ')}
Words: ${words} · Generated in ${secs}s
Em dashes present: ${text.includes('—') ? 'YES (FAIL)' : 'none'}

---

`;
  writeFileSync('/tmp/sample-report.md', header + text);
  console.log(`Done. ${words} words in ${secs}s. Em dashes: ${text.includes('—') ? 'FOUND' : 'none'}`);
  console.log('Written to /tmp/sample-report.md');
}

main().catch((e) => { console.error(e); process.exit(1); });
