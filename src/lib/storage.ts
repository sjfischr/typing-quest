import type { TypingMetrics } from "./typingEngine";
import type { LearnSession } from "./learnEngine";
import type { RescueDifficulty } from "./rescueEngine";

export type TypingStats = {
  sessions: number;
  bestWpm: number;
  averageWpm: number;
  accuracy: number;
  totalCharacters: number;
  lastPlayed: string | null;
};

const STORAGE_KEY = "typing-quest-stats";
const LEARN_STORAGE_KEY = "typing-quest-learn-sessions";
const RESCUE_STORAGE_KEY = "typing-quest-rescue-sessions";

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

export const loadLearnSessions = (): LearnSession[] => {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(LEARN_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as LearnSession[]) : [];
  } catch {
    return [];
  }
};

const saveLearnSessions = (sessions: LearnSession[]) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(LEARN_STORAGE_KEY, JSON.stringify(sessions));
};

export const recordLearnSession = (session: LearnSession) => {
  const sessions = loadLearnSessions();
  const next = [session, ...sessions].slice(0, 200);
  saveLearnSessions(next);
  return next;
};

export type RescueSession = {
  mode: "rescue";
  createdAt: string;
  difficulty: RescueDifficulty;
  status: "won" | "lost";
  wordsCompleted: number;
  wordGoal: number;
  durationMs: number;
  meterPeak: number;
  meterMax: number;
  wpm: number;
  accuracy: number;
};

export const loadRescueSessions = (): RescueSession[] => {
  if (!isBrowser()) {
    return [];
  }

  const raw = window.localStorage.getItem(RESCUE_STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RescueSession[]) : [];
  } catch {
    return [];
  }
};

const saveRescueSessions = (sessions: RescueSession[]) => {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(RESCUE_STORAGE_KEY, JSON.stringify(sessions));
};

export const recordRescueSession = (session: RescueSession) => {
  const sessions = loadRescueSessions();
  const next = [session, ...sessions].slice(0, 200);
  saveRescueSessions(next);
  return next;
};
