"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  buildSegments,
  computePercentile,
  getNextTarget,
  type LearnDifficulty,
  type LearnSegment,
  type LearnSession,
} from "@/lib/learnEngine";
import { recordLearnSession } from "@/lib/storage";

const SESSION_DURATION_MS = 120000;
const SEGMENT_DURATION_MS = 15000;
const SEGMENT_COUNT = 8;
const HUNT_THRESHOLD_MS = 900;

type LearnTotalsSnapshot = {
  correctTargets: number;
  wrongKeyPresses: number;
  avgReactionMs: number;
  p50: number;
  p90: number;
  huntRate: number;
};

type LearnEngineState = {
  status: "idle" | "running" | "complete";
  difficulty: LearnDifficulty;
  target: string;
  timeLeftMs: number;
  accuracy: number;
  avgReactionMs: number;
  p50: number;
  p90: number;
  huntRate: number;
  segments: LearnSegment[];
  activeSegment: number;
  lastPressedKey: string | null;
  lastPressedCorrect: boolean | null;
  totals: LearnTotalsSnapshot;
};

type SegmentAccumulator = {
  correct: number;
  wrong: number;
  reactionSum: number;
  targets: number;
};

const createSegmentAccumulators = (): SegmentAccumulator[] =>
  Array.from({ length: SEGMENT_COUNT }, () => ({
    correct: 0,
    wrong: 0,
    reactionSum: 0,
    targets: 0,
  }));

const buildTotalsSnapshot = (
  correctTargets: number,
  wrongKeyPresses: number,
  reactions: number[],
  huntEvents: number
): LearnTotalsSnapshot => {
  const accuracy =
    correctTargets + wrongKeyPresses === 0
      ? 100
      : Math.round((correctTargets / (correctTargets + wrongKeyPresses)) * 100);
  const avgReactionMs =
    reactions.length === 0
      ? 0
      : Math.round(reactions.reduce((sum, value) => sum + value, 0) / reactions.length);
  const p50 = computePercentile(reactions, 50);
  const p90 = computePercentile(reactions, 90);
  const huntRate =
    correctTargets === 0
      ? 0
      : Number((huntEvents / correctTargets).toFixed(2));

  return {
    correctTargets,
    wrongKeyPresses,
    avgReactionMs,
    p50,
    p90,
    huntRate,
  };
};

export const useLearnEngine = () => {
  const [difficulty, setDifficulty] = useState<LearnDifficulty>("beginner");
  const [target, setTarget] = useState("a");
  const [status, setStatus] = useState<LearnEngineState["status"]>("idle");
  const [timeLeftMs, setTimeLeftMs] = useState(SESSION_DURATION_MS);
  const [segments, setSegments] = useState<LearnSegment[]>(
    buildSegments(SEGMENT_COUNT)
  );
  const [activeSegment, setActiveSegment] = useState(0);
  const [totals, setTotals] = useState<LearnTotalsSnapshot>({
    correctTargets: 0,
    wrongKeyPresses: 0,
    avgReactionMs: 0,
    p50: 0,
    p90: 0,
    huntRate: 0,
  });
  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [lastPressedCorrect, setLastPressedCorrect] = useState<boolean | null>(null);

  const queueRef = useRef<string[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const targetShownAtRef = useRef<number>(Date.now());
  const mistakesRef = useRef(0);
  const reactionsRef = useRef<number[]>([]);
  const huntEventsRef = useRef(0);
  const correctTargetsRef = useRef(0);
  const wrongKeyPressesRef = useRef(0);
  const segmentAccumulatorsRef = useRef<SegmentAccumulator[]>(
    createSegmentAccumulators()
  );

  const resetSession = useCallback(
    (nextDifficulty = difficulty) => {
      const { letter, queue } = getNextTarget(nextDifficulty, []);
      queueRef.current = queue;
      startTimeRef.current = null;
      targetShownAtRef.current = Date.now();
      mistakesRef.current = 0;
      reactionsRef.current = [];
      huntEventsRef.current = 0;
      correctTargetsRef.current = 0;
      wrongKeyPressesRef.current = 0;
      segmentAccumulatorsRef.current = createSegmentAccumulators();
      setTarget(letter);
      setStatus("idle");
      setTimeLeftMs(SESSION_DURATION_MS);
      setSegments(buildSegments(SEGMENT_COUNT));
      setActiveSegment(0);
      setTotals({
        correctTargets: 0,
        wrongKeyPresses: 0,
        avgReactionMs: 0,
        p50: 0,
        p90: 0,
        huntRate: 0,
      });
      setLastPressedKey(null);
      setLastPressedCorrect(null);
    },
    [difficulty]
  );

  useEffect(() => {
    resetSession(difficulty);
  }, [difficulty, resetSession]);

  const updateSnapshots = useCallback(() => {
    const totalsSnapshot = buildTotalsSnapshot(
      correctTargetsRef.current,
      wrongKeyPressesRef.current,
      reactionsRef.current,
      huntEventsRef.current
    );
    setTotals(totalsSnapshot);

    const nextSegments = segmentAccumulatorsRef.current.map((segment, index) => {
      const targetsCompleted = segment.targets;
      const accuracy =
        segment.correct + segment.wrong === 0
          ? 100
          : Math.round(
              (segment.correct / (segment.correct + segment.wrong)) * 100
            );
      const avgReactionMs =
        targetsCompleted === 0 ? 0 : Math.round(segment.reactionSum / targetsCompleted);
      return {
        segmentIndex: index,
        accuracy,
        avgReactionMs,
        targetsCompleted,
      };
    });
    setSegments(nextSegments);
  }, []);

  const finalizeSession = useCallback(() => {
    const totalsSnapshot = buildTotalsSnapshot(
      correctTargetsRef.current,
      wrongKeyPressesRef.current,
      reactionsRef.current,
      huntEventsRef.current
    );
    const finalSegments = segmentAccumulatorsRef.current.map((segment, index) => {
      const targetsCompleted = segment.targets;
      const accuracy =
        segment.correct + segment.wrong === 0
          ? 100
          : Math.round(
              (segment.correct / (segment.correct + segment.wrong)) * 100
            );
      const avgReactionMs =
        targetsCompleted === 0 ? 0 : Math.round(segment.reactionSum / targetsCompleted);
      return {
        segmentIndex: index,
        accuracy,
        avgReactionMs,
        targetsCompleted,
      };
    });

    const session: LearnSession = {
      mode: "learn",
      createdAt: new Date().toISOString(),
      durationSec: 120,
      difficulty,
      totals: totalsSnapshot,
      segments: finalSegments,
    };
    recordLearnSession(session);
    setTotals(totalsSnapshot);
    setSegments(finalSegments);
    setStatus("complete");
  }, [difficulty]);

  useEffect(() => {
    if (status !== "running") {
      return;
    }

    const interval = window.setInterval(() => {
      const now = Date.now();
      const start = startTimeRef.current ?? now;
      const elapsed = now - start;
      const remaining = Math.max(0, SESSION_DURATION_MS - elapsed);
      setTimeLeftMs(remaining);
      const segmentIndex = Math.min(
        SEGMENT_COUNT - 1,
        Math.floor(elapsed / SEGMENT_DURATION_MS)
      );
      setActiveSegment(segmentIndex);

      if (remaining <= 0) {
        window.clearInterval(interval);
        finalizeSession();
      }
    }, 200);

    return () => window.clearInterval(interval);
  }, [finalizeSession, status]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (status === "complete") {
        return;
      }

      const key = event.key.toLowerCase();
      if (!/^[a-z]$/.test(key)) {
        return;
      }

      event.preventDefault();

      const now = Date.now();
      if (!startTimeRef.current) {
        startTimeRef.current = now;
        setStatus("running");
      }

      const elapsed = now - (startTimeRef.current ?? now);
      const segmentIndex = Math.min(
        SEGMENT_COUNT - 1,
        Math.floor(elapsed / SEGMENT_DURATION_MS)
      );

      if (key !== target) {
        wrongKeyPressesRef.current += 1;
        mistakesRef.current += 1;
        segmentAccumulatorsRef.current[segmentIndex].wrong += 1;
        setLastPressedKey(key);
        setLastPressedCorrect(false);
        updateSnapshots();
        window.setTimeout(() => {
          setLastPressedKey(null);
          setLastPressedCorrect(null);
        }, 180);
        return;
      }

      const reaction = now - targetShownAtRef.current;
      reactionsRef.current = [...reactionsRef.current, reaction];
      correctTargetsRef.current += 1;
      segmentAccumulatorsRef.current[segmentIndex].correct += 1;
      segmentAccumulatorsRef.current[segmentIndex].reactionSum += reaction;
      segmentAccumulatorsRef.current[segmentIndex].targets += 1;
      if (reaction > HUNT_THRESHOLD_MS) {
        huntEventsRef.current += 1;
      }

      mistakesRef.current = 0;
      setLastPressedKey(key);
      setLastPressedCorrect(true);

      const { letter, queue } = getNextTarget(difficulty, queueRef.current);
      queueRef.current = queue;
      setTarget(letter);
      targetShownAtRef.current = now;
      updateSnapshots();

      window.setTimeout(() => {
        setLastPressedKey(null);
        setLastPressedCorrect(null);
      }, 180);
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [difficulty, status, target, updateSnapshots]);

  const accuracy = totals.correctTargets + totals.wrongKeyPresses === 0
    ? 100
    : Math.round(
        (totals.correctTargets /
          (totals.correctTargets + totals.wrongKeyPresses)) *
          100
      );

  return useMemo(
    () => ({
      state: {
        status,
        difficulty,
        target,
        timeLeftMs,
        accuracy,
        avgReactionMs: totals.avgReactionMs,
        p50: totals.p50,
        p90: totals.p90,
        huntRate: totals.huntRate,
        segments,
        activeSegment,
        lastPressedKey,
        lastPressedCorrect,
        totals,
      },
      actions: {
        setDifficulty,
        resetSession,
      },
    }),
    [
      accuracy,
      activeSegment,
      difficulty,
      lastPressedCorrect,
      lastPressedKey,
      resetSession,
      segments,
      setDifficulty,
      status,
      target,
      timeLeftMs,
      totals,
    ]
  );
};
