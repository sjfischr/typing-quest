export type Pack = {
  id: string;
  title: string;
  description: string;
  texts: string[];
};

export const packs: Pack[] = [
  {
    id: "aurora",
    title: "Aurora Drift",
    description: "Soft-focus prose to build accuracy and calm rhythm.",
    texts: [
      "Aurora light washes over the ridge, and the air feels like glass.",
      "Slow breath, steady hands, every keystroke a ripple on still water.",
      "You glide through the sentence, letting the shimmer guide your pace.",
    ],
  },
  {
    id: "circuit",
    title: "Circuit Sprint",
    description: "Short, punchy bursts that reward quick resets.",
    texts: [
      "Signal locked. Pulse steady. Sprint the line and reset.",
      "Fast fingers, clean inputs, crisp cadence, no stutters.",
      "Focus sharp, tempo high, accuracy tight, finish strong.",
    ],
  },
  {
    id: "nebula",
    title: "Nebula Stories",
    description: "Longer runs for stamina and flow.",
    texts: [
      "The city hums like a synth pad, neon layers drifting through the night as you stay focused on each letter.",
      "A glass corridor arcs above the sea, and every step echoes while your cursor follows the sentence home.",
      "You chase the horizon, typing with intent, a quiet quest to turn each line into a clean landing.",
    ],
  },
];
