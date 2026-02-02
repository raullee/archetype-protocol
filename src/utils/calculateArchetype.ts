export const calculateArchetype = (answers: string[]) => {
  const archetypeScores: { [key: string]: number } = {
    Structure: 0,
    Spirituality: 0,
    Connection: 0,
    Legacy: 0,
  };

  answers.forEach((answer) => {
    if (archetypeScores[answer] !== undefined) {
      archetypeScores[answer] += 1;
    }
  });

  const sortedArchetypes = Object.entries(archetypeScores).sort(
    (a, b) => b[1] - a[1]
  );

  return sortedArchetypes.slice(0, 3).map((archetype) => archetype[0]);
};
