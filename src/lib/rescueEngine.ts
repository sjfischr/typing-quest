import { packs } from "@/content/packs";

export type RescueDifficulty = "easy" | "medium" | "hard";

export type RescueConfig = {
  passiveFillPerSecond: number;
  typoSpike: number;
  healOnComplete: number;
  meterMax: number;
  wordGoal: number;
  durationMs: number;
};

export const RESCUE_CONFIG: Record<RescueDifficulty, RescueConfig> = {
  easy: {
    passiveFillPerSecond: 0.75,
    typoSpike: 7,
    healOnComplete: 22,
    meterMax: 100,
    wordGoal: 18,
    durationMs: 120_000,
  },
  medium: {
    passiveFillPerSecond: 1.35,
    typoSpike: 11,
    healOnComplete: 16,
    meterMax: 100,
    wordGoal: 20,
    durationMs: 120_000,
  },
  hard: {
    passiveFillPerSecond: 2.6,
    typoSpike: 18,
    healOnComplete: 11,
    meterMax: 100,
    wordGoal: 22,
    durationMs: 120_000,
  },
};

export type RescueState = {
  status: "idle" | "running" | "won" | "lost";
  difficulty: RescueDifficulty;
  meter: number;
  meterMax: number;
  timeLeftMs: number;
  wordGoal: number;
  completed: number;
  streak: number;
  target: string;
  targetIndex: number;
  targets: string[];
  meterPeak: number;
};

const flattenPackTexts = () => packs.flatMap((pack) => pack.texts);

const EASY_WORDS = [
  "cat",
  "sun",
  "moon",
  "glass",
  "wind",
  "sky",
  "calm",
  "soft",
  "glow",
  "flow",
  "song",
  "green",
  "bright",
  "swift",
  "happy",
  "spark",
  "quiet",
  "brave",
  "dream",
  "drift",
  "cloud",
];

const filterByDifficulty = (difficulty: RescueDifficulty, texts: string[]) => {
  if (difficulty === "easy") {
    return [...EASY_WORDS, ...texts.filter((text) => text.length >= 3 && text.length <= 22)];
  }
  if (difficulty === "medium") {
    return texts.filter((text) => text.length >= 10 && text.length <= 70);
  }
  return texts.filter((text) => text.length >= 10);
};

export const buildTargets = (difficulty: RescueDifficulty): string[] => {
  const base = flattenPackTexts();
  const filtered = filterByDifficulty(difficulty, base);
  if (filtered.length === 0) {
    return ["glass", "rescue", "aurora", "flow"];
  }
  return filtered;
};

export const createRescueState = (difficulty: RescueDifficulty): RescueState => {
  const config = RESCUE_CONFIG[difficulty];
  const targets = buildTargets(difficulty);
  return {
    status: "idle",
    difficulty,
    meter: 0,
    meterMax: config.meterMax,
    timeLeftMs: config.durationMs,
    wordGoal: config.wordGoal,
    completed: 0,
    streak: 0,
    targetIndex: 0,
    target: targets[0],
    targets,
    meterPeak: 0,
  };
};

export const getStreakBonus = (streak: number) => Math.min(6, Math.max(0, streak - 2));

export const applyTimeTick = (state: RescueState, deltaMs: number): RescueState => {
  if (state.status !== "running") return state;
  const config = RESCUE_CONFIG[state.difficulty];
  const delta = (config.passiveFillPerSecond / 1000) * deltaMs;
  const nextMeter = Math.min(state.meterMax, state.meter + delta);
  const nextTime = Math.max(0, state.timeLeftMs - deltaMs);
  const lost = nextMeter >= state.meterMax;
  const won = !lost && (state.completed >= state.wordGoal || nextTime === 0);
  return {
    ...state,
    meter: nextMeter,
    meterPeak: Math.max(state.meterPeak, nextMeter),
    timeLeftMs: nextTime,
    status: lost ? "lost" : won ? "won" : "running",
  };
};

export const applyTypoSpike = (state: RescueState): RescueState => {
  if (state.status !== "running") return state;
  const config = RESCUE_CONFIG[state.difficulty];
  const nextMeter = Math.min(state.meterMax, state.meter + config.typoSpike);
  const lost = nextMeter >= state.meterMax;
  return {
    ...state,
    streak: 0,
    meter: nextMeter,
    meterPeak: Math.max(state.meterPeak, nextMeter),
    status: lost ? "lost" : state.status,
  };
};

export const completeTarget = (state: RescueState): RescueState => {
  if (state.status !== "running") return state;
  const config = RESCUE_CONFIG[state.difficulty];
  const streak = state.streak + 1;
  const streakBonus = getStreakBonus(streak);
  const heal = Math.max(0, config.healOnComplete + streakBonus);
  const nextMeter = Math.max(0, state.meter - heal);
  const completed = state.completed + 1;
  const nextIndex = (state.targetIndex + 1) % state.targets.length;
  const nextTarget = state.targets[nextIndex];
  const won = completed >= config.wordGoal;
  return {
    ...state,
    meter: nextMeter,
    meterPeak: Math.max(state.meterPeak, state.meter),
    completed,
    streak,
    targetIndex: nextIndex,
    target: nextTarget,
    status: won ? "won" : state.status,
  };
};

export const startRun = (state: RescueState): RescueState => {
  if (state.status === "running") return state;
  return { ...state, status: "running" };
};

export const resetRun = (difficulty: RescueDifficulty): RescueState =>
  createRescueState(difficulty);
