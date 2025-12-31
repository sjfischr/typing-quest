export type CharState = "correct" | "incorrect" | "pending";

export type TypingMetrics = {
  wpm: number;
  accuracy: number;
  correct: number;
  errors: number;
  durationMs: number;
  characters: number;
};

export const getCharStates = (target: string, input: string): CharState[] => {
  const states: CharState[] = [];
  for (let i = 0; i < target.length; i += 1) {
    const expected = target[i];
    const typed = input[i];
    if (typed === undefined) {
      states.push("pending");
    } else if (typed === expected) {
      states.push("correct");
    } else {
      states.push("incorrect");
    }
  }
  return states;
};

export const clampInput = (input: string, target: string) =>
  input.slice(0, target.length);

export const calculateMetrics = (
  target: string,
  input: string,
  durationMs: number
): TypingMetrics => {
  const capped = clampInput(input, target);
  const states = getCharStates(target, capped);
  const correct = states.filter((state) => state === "correct").length;
  const characters = capped.length;
  const errors = Math.max(0, characters - correct);
  const minutes = Math.max(durationMs / 60000, 1 / 60);
  const grossWpm = Math.round((characters / 5) / minutes);
  const accuracy = characters === 0 ? 100 : Math.round((correct / characters) * 100);
  const wpm = Math.max(0, Math.round(grossWpm * (accuracy / 100)));

  return {
    wpm,
    accuracy,
    correct,
    errors,
    durationMs,
    characters,
  };
};
