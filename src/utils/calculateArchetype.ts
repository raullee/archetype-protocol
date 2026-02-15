import { Archetype, ARCHETYPE_DATA, ARCHETYPE_QUADRANTS, ALL_ARCHETYPES } from "@/lib/archetypes";

export interface ArchetypeResult {
  archetype: Archetype;
  score: number;
  percentage: number;
}

export const calculateArchetype = (answers: Archetype[]): ArchetypeResult[] => {
  const scores: Record<string, number> = {};
  ALL_ARCHETYPES.forEach((a) => (scores[a] = 0));
  answers.forEach((a) => { scores[a] = (scores[a] || 0) + 1; });

  const total = answers.length;
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([archetype, score]) => ({
      archetype: archetype as Archetype,
      score,
      percentage: Math.round((score / total) * 100),
    }));
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
