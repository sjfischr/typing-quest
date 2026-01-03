"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { calculateMetrics, clampInput } from "@/lib/typingEngine";
import {
  applyTimeTick,
  applyTypoSpike,
  completeTarget,
  createRescueState,
  resetRun,
  startRun,
  type RescueDifficulty,
  type RescueState,
} from "@/lib/rescueEngine";
import { getCharStates } from "@/lib/typingEngine";
import type { TypingMetrics } from "@/lib/typingEngine";

const TICK_MS = 200;

export const useRescueEngine = (initialDifficulty: RescueDifficulty = "medium") => {
  const [state, setState] = useState<RescueState>(() => createRescueState(initialDifficulty));
  const [input, setInput] = useState("");
  const [metrics, setMetrics] = useState<TypingMetrics | null>(null);
  const [healPulseId, setHealPulseId] = useState(0);
  const [errorPulseId, setErrorPulseId] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const penalizedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const id = window.setInterval(() => {
      setState((prev) => applyTimeTick(prev, TICK_MS));
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const meterPercent = useMemo(
    () => Math.min(100, Math.max(0, Math.round((state.meter / state.meterMax) * 100))),
    [state.meter, state.meterMax]
  );

  const setDifficulty = (difficulty: RescueDifficulty) => {
    penalizedRef.current.clear();
    startedAtRef.current = null;
    setInput("");
    setMetrics(null);
    setState(createRescueState(difficulty));
  };

  const handleInput = (value: string) => {
    setState((prev) => {
      if (prev.status === "won" || prev.status === "lost") return prev;
      const target = prev.target;
      const nextValue = clampInput(value, target);
      let nextState = prev.status === "idle" ? startRun(prev) : prev;

      if (!startedAtRef.current && nextValue.length > 0) {
        startedAtRef.current = Date.now();
      }

      const charStates = getCharStates(target, nextValue);
      charStates.forEach((stateValue, index) => {
        if (stateValue === "incorrect" && !penalizedRef.current.has(index)) {
          penalizedRef.current.add(index);
          nextState = applyTypoSpike(nextState);
          setErrorPulseId((id) => id + 1);
        }
      });

      setInput(nextValue);

      if (startedAtRef.current) {
        const duration = Date.now() - startedAtRef.current;
        setMetrics(calculateMetrics(target, nextValue, duration));
      }

      if (nextValue === target) {
        penalizedRef.current.clear();
        startedAtRef.current = null;
        nextState = completeTarget(nextState);
        setHealPulseId((id) => id + 1);
        setInput("");
        setMetrics(null);
      }

      return nextState;
    });
  };

  const reset = () => {
    penalizedRef.current.clear();
    startedAtRef.current = null;
    setInput("");
    setMetrics(null);
    setState((prev) => resetRun(prev.difficulty));
  };

  return {
    state,
    input,
    metrics,
    meterPercent,
    healPulseId,
    errorPulseId,
    setDifficulty,
    handleInput,
    reset,
  };
};
