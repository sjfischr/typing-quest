import type { TypingMetrics } from "./typingEngine";

export type TypingStats = {
  sessions: number;
  bestWpm: number;
  averageWpm: number;
  accuracy: number;
  totalCharacters: number;
  lastPlayed: string | null;
};

const STORAGE_KEY = "typing-quest-stats";

export const defaultStats: TypingStats = {
  sessions: 0,
  bestWpm: 0,
  averageWpm: 0,
  accuracy: 100,
  totalCharacters: 0,
  lastPlayed: null,
};

const isBrowser = () => typeof window !== "undefined";

export const loadStats = (): TypingStats => {
  if (!isBrowser()) {
    return defaultStats;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultStats;
  }

  try {
    return { ...defaultStats, ...JSON.parse(raw) } as TypingStats;
  } catch {
    return defaultStats;
  }
};

export const saveStats = (stats: TypingStats) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
};

export const recordSession = (metrics: TypingMetrics): TypingStats => {
  const existing = loadStats();
  const sessions = existing.sessions + 1;
  const bestWpm = Math.max(existing.bestWpm, metrics.wpm);
  const averageWpm = Math.round(
    (existing.averageWpm * existing.sessions + metrics.wpm) / sessions
  );
  const accuracy = Math.round(
    (existing.accuracy * existing.sessions + metrics.accuracy) / sessions
  );
  const totalCharacters = existing.totalCharacters + metrics.characters;
  const next = {
    sessions,
    bestWpm,
    averageWpm,
    accuracy,
    totalCharacters,
    lastPlayed: new Date().toISOString(),
  };
  saveStats(next);
  return next;
};

export const resetStats = (): TypingStats => {
  saveStats(defaultStats);
  return defaultStats;
};
