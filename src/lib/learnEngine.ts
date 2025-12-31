export type LearnDifficulty = "beginner" | "intermediate" | "advanced";

export type LearnSegment = {
  segmentIndex: number;
  accuracy: number;
  avgReactionMs: number;
  targetsCompleted: number;
};

export type LearnSessionTotals = {
  correctTargets: number;
  wrongKeyPresses: number;
  avgReactionMs: number;
  p50: number;
  p90: number;
  huntRate: number;
  shiftedTargets: number;
};

export type LearnSession = {
  mode: "learn";
  createdAt: string;
  durationSec: 120;
  difficulty: LearnDifficulty;
  totals: LearnSessionTotals;
  segments: LearnSegment[];
};

export type FingerId =
  | "leftPinky"
  | "leftRing"
  | "leftMiddle"
  | "leftIndex"
  | "rightIndex"
  | "rightMiddle"
  | "rightRing"
  | "rightPinky";

export const FINGER_MAP: Record<string, FingerId> = {
  "`": "leftPinky",
  "1": "leftPinky",
  "!": "leftPinky",
  "2": "leftRing",
  "@": "leftRing",
  "3": "leftMiddle",
  "#": "leftMiddle",
  "4": "leftIndex",
  "$": "leftIndex",
  "5": "leftIndex",
  "%": "leftIndex",
  "6": "rightIndex",
  "^": "rightIndex",
  "7": "rightIndex",
  "&": "rightIndex",
  "8": "rightMiddle",
  "*": "rightMiddle",
  "9": "rightRing",
  "(": "rightRing",
  "0": "rightPinky",
  ")": "rightPinky",
  "-": "rightPinky",
  "_": "rightPinky",
  "=": "rightPinky",
  "+": "rightPinky",
  q: "leftPinky",
  a: "leftPinky",
  z: "leftPinky",
  w: "leftRing",
  s: "leftRing",
  x: "leftRing",
  e: "leftMiddle",
  d: "leftMiddle",
  c: "leftMiddle",
  r: "leftIndex",
  f: "leftIndex",
  v: "leftIndex",
  t: "leftIndex",
  g: "leftIndex",
  b: "leftIndex",
  y: "rightIndex",
  h: "rightIndex",
  n: "rightIndex",
  u: "rightIndex",
  j: "rightIndex",
  m: "rightIndex",
  i: "rightMiddle",
  k: "rightMiddle",
  o: "rightRing",
  l: "rightRing",
  ",": "rightMiddle",
  "<": "rightMiddle",
  ".": "rightRing",
  ">": "rightRing",
  "/": "rightPinky",
  "?": "rightPinky",
  "[": "rightPinky",
  "{": "rightPinky",
  "]": "rightPinky",
  "}": "rightPinky",
  "\\": "rightPinky",
  "|": "rightPinky",
  ";": "rightPinky",
  ":": "rightPinky",
  "'": "rightPinky",
  "\"": "rightPinky",
  p: "rightPinky",
};

export const HOME_KEYS: Record<FingerId, string> = {
  leftPinky: "a",
  leftRing: "s",
  leftMiddle: "d",
  leftIndex: "f",
  rightIndex: "j",
  rightMiddle: "k",
  rightRing: "l",
  rightPinky: ";",
};

export type FingerGuidance = {
  fingerId: FingerId;
  baseKey: string;
  shiftKey?: "shift-left" | "shift-right";
};

const SHIFTED_SYMBOLS: Record<string, string> = {
  "~": "`",
  "!": "1",
  "@": "2",
  "#": "3",
  "$": "4",
  "%": "5",
  "^": "6",
  "&": "7",
  "*": "8",
  "(": "9",
  ")": "0",
  "_": "-",
  "+": "=",
  "{": "[",
  "}": "]",
  "|": "\\",
  ":": ";",
  "\"": "'",
  "<": ",",
  ">": ".",
  "?": "/",
};

export type KeyMeta = {
  baseKey: string;
  shifted: boolean;
  isLetter: boolean;
};

const LEFT_HAND: FingerId[] = [
  "leftPinky",
  "leftRing",
  "leftMiddle",
  "leftIndex",
];

export const getFingerGuidance = (key: string): FingerGuidance => {
  const meta = getKeyMeta(key);
  const fingerId = FINGER_MAP[meta.baseKey] ?? "leftIndex";
  const requiresShift = meta.shifted;
  const shiftKey = requiresShift
    ? LEFT_HAND.includes(fingerId)
      ? "shift-left"
      : "shift-right"
    : undefined;

  return { fingerId, baseKey: meta.baseKey, shiftKey };
};

export const getKeyMeta = (key: string): KeyMeta => {
  const normalized = key.length === 1 ? key : key.toLowerCase();
  const isLetter = /^[a-zA-Z]$/.test(normalized);
  if (isLetter) {
    const baseKey = normalized.toLowerCase();
    return { baseKey, shifted: normalized !== normalized.toLowerCase(), isLetter };
  }

  const baseKey = SHIFTED_SYMBOLS[normalized] ?? normalized;
  const shifted = baseKey !== normalized;
  return { baseKey, shifted, isLetter: false };
};

const HOME_ROW = ["a", "s", "d", "f", "j", "k", "l"];
const REACH_ROW = ["r", "e", "i", "o", "t", "g", "h"];
const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("");

const COMMON_LETTERS = [
  "e",
  "t",
  "a",
  "o",
  "i",
  "n",
  "s",
  "h",
  "r",
  "d",
  "l",
  "u",
];

const DIGRAPHS = ["th", "he", "in", "er", "an", "re", "on", "at", "en", "nd"];

const buildWeightedPool = (letters: string[], weight = 1) =>
  letters.flatMap((letter) => Array.from({ length: weight }).map(() => letter));

const beginnerPool = [
  ...buildWeightedPool(HOME_ROW, 6),
  ...buildWeightedPool(REACH_ROW, 2),
  ...buildWeightedPool(ALPHABET, 1),
];

const intermediatePool = [
  ...buildWeightedPool(COMMON_LETTERS, 4),
  ...buildWeightedPool(ALPHABET, 1),
];

const pickFromPool = (pool: string[]) =>
  pool[Math.floor(Math.random() * pool.length)];

export const getNextTarget = (
  difficulty: LearnDifficulty,
  pending: string[]
): { letter: string; queue: string[] } => {
  if (pending.length > 0) {
    const [letter, ...rest] = pending;
    return { letter, queue: rest };
  }

  if (difficulty === "advanced") {
    const roll = Math.random();
    if (roll < 0.5) {
      const digraph = DIGRAPHS[Math.floor(Math.random() * DIGRAPHS.length)];
      return { letter: digraph[0], queue: [digraph[1]] };
    }
    return { letter: pickFromPool(intermediatePool), queue: [] };
  }

  if (difficulty === "intermediate") {
    return { letter: pickFromPool(intermediatePool), queue: [] };
  }

  return { letter: pickFromPool(beginnerPool), queue: [] };
};

export const computePercentile = (values: number[], percentile: number) => {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
};

export const buildSegments = (count: number): LearnSegment[] =>
  Array.from({ length: count }, (_, index) => ({
    segmentIndex: index,
    accuracy: 100,
    avgReactionMs: 0,
    targetsCompleted: 0,
  }));
