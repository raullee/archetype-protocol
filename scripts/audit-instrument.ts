/**
 * Exhaustively audits the REAL scoring module (not a reimplementation) across
 * every possible answer path: 6 options ^ 8 questions = 1,679,616.
 *
 * Run: npx tsx scripts/audit-instrument.ts
 *
 * Guards two properties that are easy to break and impossible to notice by hand:
 *   - COVERAGE: every archetype offered in exactly 4 of 8 questions.
 *   - UNIFORMITY: no archetype dominates the primary result by list position.
 */
import { QUESTIONS } from "../src/lib/questions";
import { ALL_ARCHETYPES, Archetype } from "../src/lib/archetypes";
import { calculateArchetype, QUESTION_WEIGHTS } from "../src/utils/calculateArchetype";

const IDEAL = 100 / ALL_ARCHETYPES.length;

// ── Coverage ────────────────────────────────────────────────────────────
const coverage = {} as Record<Archetype, number>;
ALL_ARCHETYPES.forEach((a) => (coverage[a] = 0));
QUESTIONS.forEach((q) => {
  const seen = new Set(q.options.map((o) => o.archetype));
  if (seen.size !== q.options.length) {
    throw new Error(`Q${q.id} offers the same archetype twice`);
  }
  seen.forEach((a) => (coverage[a] += 1));
});

// ── Available weight per archetype ──────────────────────────────────────
// Count balance alone is insufficient once questions are weighted: an archetype
// offered only on light questions can never compete with one offered on heavy
// questions. Weight-tier pairing keeps these within a narrow band.
const availWeight = {} as Record<Archetype, number>;
ALL_ARCHETYPES.forEach((a) => (availWeight[a] = 0));
QUESTIONS.forEach((q) => {
  const w = QUESTION_WEIGHTS[q.id] ?? 1;
  new Set(q.options.map((o) => o.archetype)).forEach((a) => (availWeight[a] += w));
});
const idealWeight =
  ALL_ARCHETYPES.reduce((s, a) => s + availWeight[a], 0) / ALL_ARCHETYPES.length;

console.log("COVERAGE (count must be 4/8; weight must be near ideal)");
console.log("-".repeat(56));
let coverageOk = true;
ALL_ARCHETYPES.forEach((a) => {
  const ok = coverage[a] === 4;
  if (!ok) coverageOk = false;
  console.log(
    `  ${a.padEnd(12)} ${coverage[a]}/8   weight ${availWeight[a].toFixed(1)}  ${ok ? "ok" : "<-- IMBALANCED"}`
  );
});
const wMax = Math.max(...ALL_ARCHETYPES.map((a) => availWeight[a]));
const wMin = Math.min(...ALL_ARCHETYPES.map((a) => availWeight[a]));
console.log(
  `  ideal weight ${idealWeight.toFixed(2)} | actual range ${wMin.toFixed(1)}-${wMax.toFixed(1)} (${(wMax / wMin).toFixed(2)}x)`
);

// ── Exhaustive enumeration ──────────────────────────────────────────────
const primary = {} as Record<Archetype, number>;
ALL_ARCHETYPES.forEach((a) => (primary[a] = 0));

const opts = QUESTIONS.map((q) => q.options.map((o) => o.archetype));
const answers: Archetype[] = new Array(QUESTIONS.length);
let total = 0;
let ties = 0;

function walk(depth: number) {
  if (depth === opts.length) {
    const ranked = calculateArchetype(answers);
    primary[ranked[0].archetype] += 1;
    if (Math.abs(ranked[0].score - ranked[1].score) < 1e-9) ties += 1;
    total += 1;
    return;
  }
  for (const a of opts[depth]) {
    answers[depth] = a;
    walk(depth + 1);
  }
}
walk(0);

console.log(`\nPRIMARY DISTRIBUTION over all ${total.toLocaleString()} answer paths`);
console.log(`(ideal = ${IDEAL.toFixed(2)}% each)`);
console.log("-".repeat(56));
const shares = ALL_ARCHETYPES.map((a) => (100 * primary[a]) / total);
ALL_ARCHETYPES.forEach((a, i) => {
  const pct = shares[i];
  const bar = "#".repeat(Math.max(0, Math.round(pct / 1.5)));
  console.log(`  ${a.padEnd(12)} ${pct.toFixed(2).padStart(6)}%  ${bar}`);
});

const max = Math.max(...shares);
const min = Math.min(...shares);
console.log(`\n  spread (max/min) : ${(max / min).toFixed(1)}x   [was 54.0x]`);
console.log(`  unresolved ties  : ${((100 * ties) / total).toFixed(2)}%   [was 47.70%]`);
console.log(`  coverage balanced: ${coverageOk}`);

if (!coverageOk) {
  console.error("\nFAIL: coverage is not 4/8 for every archetype.");
  process.exit(1);
}
if (max / min > 3) {
  console.error(`\nFAIL: primary distribution spread ${(max / min).toFixed(1)}x exceeds 3x.`);
  process.exit(1);
}
console.log("\nPASS");
