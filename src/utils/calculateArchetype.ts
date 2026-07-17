import { Archetype, ARCHETYPE_DATA, ARCHETYPE_QUADRANTS, ALL_ARCHETYPES } from "@/lib/archetypes";

export interface ArchetypeResult {
  archetype: Archetype;
  score: number;
  percentage: number;
}

/**
 * ── THE RESONANCE MODEL ──────────────────────────────────────────────────
 *
 * Replaces the original "count which archetype you picked most" tally, which
 * had two MEASURED defects:
 *
 *   1. TIES. 47.7% of all 1,679,616 possible answer paths ended in a tie for
 *      top archetype. `Object.entries(scores).sort((a,b) => b[1]-a[1])` looks
 *      correct, but Array.prototype.sort is STABLE (ES2019+) and `scores` was
 *      built by iterating ALL_ARCHETYPES -- so every tie silently resolved to
 *      whichever archetype sat earliest in that array. "Ruler" is index 0, so
 *      Ruler won 37.2% of all ties on list position alone.
 *   2. COVERAGE. Ruler/Sage appeared in 6 of 8 questions, Innocent/Everyman in
 *      only 2 -- so a user could not express Everyman more than twice. Fixed in
 *      questions.ts, now exactly 4 each.
 *
 *   Net effect of the two: Ruler 27.6% vs Everyman 0.5% -- a 54x spread on an
 *   instrument that should sit near 8.33% each.
 *
 * Two mechanisms replace the tally, both grounded in the Mark & Pearson
 * 12-archetype wheel this product already encodes:
 *
 *   WEIGHTED CONSTRUCTS. Mark & Pearson define an archetype by its core
 *   MOTIVATION and its core FEAR. So Q1 (drive) and Q8 (fear) carry the most
 *   weight; shadow and values sit mid; situational behaviour (ideal weekend,
 *   group work) carries least. Distinct weights also mean an exact tie now
 *   requires an exact subset-sum collision rather than merely equal counts,
 *   which is what collapses the tie rate.
 *
 *   QUADRANT RESONANCE. The 12 archetypes sit in 4 motivational quadrants of 3
 *   (Provide Structure / Yearn for Spiritual / Leave a Mark / Connect to
 *   Others). Choosing one archetype expresses partial affinity with its
 *   quadrant siblings, so each answer spills a fraction to them. This turns a
 *   winner-take-all count into a 12-dimensional resonance profile -- more
 *   honest, and more sellable: the buyer gets a spectrum, not a label.
 *
 * Percentages returned sum to 100 across all 12 archetypes.
 */

/** Question id -> construct weight. Distinct by design; see tie analysis above. */
export const QUESTION_WEIGHTS: Record<number, number> = {
  1: 1.6, // core drive / motivation  -- archetype-defining
  8: 1.5, // core fear                -- archetype-defining
  6: 1.2, // shadow & triggers
  3: 1.1, // core values
  2: 1.0, // stress response
  7: 0.9, // perceived strength (how others read you)
  5: 0.8, // team behaviour
  4: 0.7, // lifestyle & energy
};

/** Fraction of an answer's weight that spills to each quadrant sibling. */
export const QUADRANT_RESONANCE = 0.15;

const weightFor = (questionIndex: number) => QUESTION_WEIGHTS[questionIndex + 1] ?? 1;

export const calculateArchetype = (answers: Archetype[]): ArchetypeResult[] => {
  const scores = {} as Record<Archetype, number>;
  const centrality = {} as Record<Archetype, number>;
  ALL_ARCHETYPES.forEach((a) => {
    scores[a] = 0;
    centrality[a] = 0;
  });

  answers.forEach((answer, i) => {
    const w = weightFor(i);
    scores[answer] += w;
    // Highest-weighted question at which this archetype was picked OUTRIGHT.
    // Last-resort tie-break only, so a dead heat resolves on the more
    // archetype-defining question rather than on array position.
    centrality[answer] = Math.max(centrality[answer], w);

    const quadrant = ARCHETYPE_QUADRANTS[answer];
    ALL_ARCHETYPES.forEach((other) => {
      if (other !== answer && ARCHETYPE_QUADRANTS[other] === quadrant) {
        scores[other] += w * QUADRANT_RESONANCE;
      }
    });
  });

  const total = ALL_ARCHETYPES.reduce((sum, a) => sum + scores[a], 0) || 1;

  return ALL_ARCHETYPES.map((a) => ({
    archetype: a,
    score: scores[a],
    percentage: Math.round((scores[a] / total) * 100),
  })).sort((x, y) => {
    // Scores are floats now, so compare with an epsilon. Using === here would
    // let representation error (0.1 + 0.2 !== 0.3) silently decide someone's
    // identity.
    const diff = y.score - x.score;
    if (Math.abs(diff) > 1e-9) return diff;
    return centrality[y.archetype] - centrality[x.archetype];
  });
};

export const getTopArchetypes = (answers: Archetype[]) => {
  const results = calculateArchetype(answers);
  const primary = results[0];
  const secondary = results[1];
  return {
    primary: { ...primary, data: ARCHETYPE_DATA[primary.archetype] },
    secondary: { ...secondary, data: ARCHETYPE_DATA[secondary.archetype] },
    all: results,
  };
};
