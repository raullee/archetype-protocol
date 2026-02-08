import { Archetype, ARCHETYPE_DETAILS } from "@/lib/archetypes";

export const calculateArchetype = (answers: Archetype[]) => {
  const archetypeScores: { [key in Archetype]?: number } = {};

  // Initialize scores for all archetypes to 0
  for (const key in ARCHETYPE_DETAILS) {
    archetypeScores[key as Archetype] = 0;
  }

  answers.forEach((answer) => {
    if (archetypeScores[answer] !== undefined) {
      archetypeScores[answer]! += 1;
    }
  });

  const sortedArchetypes = Object.entries(archetypeScores).sort(
    (a, b) => (b[1] ?? 0) - (a[1] ?? 0)
  );

  return sortedArchetypes.slice(0, 3).map((archetype) => archetype[0]);
};
