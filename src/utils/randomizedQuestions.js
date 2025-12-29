// Utility to shuffle and randomize questions within each level
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Get randomized question set for a level
export function getRandomizedQuestions(level) {
  if (!level || !level.questions) return [];
  // Shuffle questions but keep first 2 and last 1 fixed for progression
  const questions = [...level.questions];
  if (questions.length <= 7) {
    // If 7 or fewer, shuffle all but keep first question
    const first = questions[0];
    const rest = shuffleArray(questions.slice(1));
    return [first, ...rest];
  }
  return shuffleArray(questions).slice(0, 7);
}

// Store randomized question sets per level
let randomizedLevelSets = {};

export function getRandomizedLevelSet(levelIndex) {
  if (!randomizedLevelSets[levelIndex]) {
    randomizedLevelSets[levelIndex] = {};
  }
  return randomizedLevelSets[levelIndex];
}

export function setRandomizedLevelSet(levelIndex, questionSet) {
  if (!randomizedLevelSets[levelIndex]) {
    randomizedLevelSets[levelIndex] = {};
  }
  randomizedLevelSets[levelIndex] = questionSet;
}

// Reset randomized sets (for new game)
export function resetRandomizedSets() {
  randomizedLevelSets = {};
}
