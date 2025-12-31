"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import GlassCard from "@/components/GlassCard";
import GlassSelect from "@/components/GlassSelect";
import GlassButton from "@/components/GlassButton";
import LearnKeyboard from "@/components/LearnKeyboard";
import { getFingerGuidance, type LearnDifficulty } from "@/lib/learnEngine";
import { useLearnEngine } from "@/hooks/useLearnEngine";

const difficultyOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const formatTime = (ms: number) => {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const fingerHint = (key: string) => {
  const guidance = getFingerGuidance(key);
  const finger = guidance.fingerId;
  const shiftHint = guidance.shiftKey
    ? `Hold ${guidance.shiftKey === "shift-left" ? "left" : "right"} shift`
    : null;
  switch (finger) {
    case "leftPinky":
      return shiftHint ? `${shiftHint} + pinky finger (left)` : "Pinky finger (left)";
    case "leftRing":
      return shiftHint ? `${shiftHint} + ring finger (left)` : "Ring finger (left)";
    case "leftMiddle":
      return shiftHint
        ? `${shiftHint} + middle finger (left)`
        : "Middle finger (left)";
    case "leftIndex":
      return shiftHint ? `${shiftHint} + index finger (left)` : "Index finger (left)";
    case "rightIndex":
      return shiftHint
        ? `${shiftHint} + index finger (right)`
        : "Index finger (right)";
    case "rightMiddle":
      return shiftHint
        ? `${shiftHint} + middle finger (right)`
        : "Middle finger (right)";
    case "rightRing":
      return shiftHint ? `${shiftHint} + ring finger (right)` : "Ring finger (right)";
    case "rightPinky":
      return shiftHint ? `${shiftHint} + pinky finger (right)` : "Pinky finger (right)";
    default:
      return "Home row focus";
  }
};

const segmentTone = (accuracy: number) => {
  if (accuracy >= 95) {
    return "bg-emerald-200/50";
  }
  if (accuracy >= 85) {
    return "bg-cyan-200/40";
  }
  return "bg-rose-200/30";
};

export default function LearnPage() {
  const { state, actions } = useLearnEngine();
  const [showFingerLabels, setShowFingerLabels] = useState(false);
  const guidance = getFingerGuidance(state.target);
  const pressedGuidance = state.lastPressedKey
    ? getFingerGuidance(state.lastPressedKey)
    : null;

  return (
    <PageShell
      className="learn-layout h-[100dvh] overflow-hidden pt-4 pb-4 sm:pt-6 sm:pb-6"
      mainClassName="mt-4 flex-1 min-h-0"
    >
      <div className="learn-stack flex h-full flex-col gap-6">
        <GlassCard className="learn-header flex-none">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
                Learn the Keys
              </p>
              <h1 className="text-3xl font-semibold text-white">
                Home row guided drill
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <GlassButton
                variant="ghost"
                onClick={() => setShowFingerLabels((prev) => !prev)}
              >
                {showFingerLabels ? "Hide Labels" : "Show Labels"}
              </GlassButton>
              <GlassSelect
                aria-label="Select difficulty"
                value={state.difficulty}
                onChange={(event) =>
                  actions.setDifficulty(event.target.value as LearnDifficulty)
                }
                options={difficultyOptions}
              />
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
            <div className="glass-surface flex flex-col gap-4 rounded-2xl px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                    Timer
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {formatTime(state.timeLeftMs)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                    Accuracy
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {state.accuracy}%
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                    Avg Reaction
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {state.avgReactionMs}ms
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                    Segment
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {state.activeSegment + 1}/8
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {state.segments.map((segment) => (
                  <span
                    key={segment.segmentIndex}
                    className={`h-2 flex-1 rounded-full ${segmentTone(
                      segment.accuracy
                    )} ${
                      segment.segmentIndex === state.activeSegment
                        ? "ring-1 ring-white/60"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="glass-surface flex flex-col gap-3 rounded-2xl px-4 py-4 text-sm text-white/70">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Session Targets
              </p>
              <p>Stay on the right finger. Wrong keys do not advance.</p>
              <p>Reaction time logs when the correct key lands.</p>
              <p>Hunt events trigger when reactions exceed 900ms.</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="learn-keyboard-card flex-1 min-h-0 overflow-hidden">
          <div className="flex h-full flex-col gap-6">
            <div className="flex-1 min-h-0 overflow-auto px-1">
          <LearnKeyboard
            targetKey={guidance.baseKey}
            lastPressedKey={pressedGuidance?.baseKey ?? null}
            lastPressedCorrect={state.lastPressedCorrect}
            activeFingerId={guidance.fingerId}
            fingerTargetKey={guidance.baseKey}
            shiftTargetKey={guidance.shiftKey}
            showFingerLabels={showFingerLabels}
            className="mx-auto"
          />
            </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
              Target Key
            </p>
            <div className="text-6xl font-semibold text-white">{state.target}</div>
            {guidance.shiftKey ? (
              <p className="text-xs uppercase tracking-widest text-cyan-100/80">
                Shift +{" "}
                {guidance.baseKey.length === 1
                  ? guidance.baseKey.toUpperCase()
                  : guidance.baseKey}
              </p>
            ) : null}
            <p className="text-sm text-white/70">{fingerHint(state.target)}</p>
          </div>
          </div>
        </GlassCard>
      </div>

      {state.status === "complete" ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
          <GlassCard className="w-full max-w-xl space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
                Session Complete
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-white">
                Learn results
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass-surface rounded-2xl px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Accuracy
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {state.accuracy}%
                </p>
              </div>
              <div className="glass-surface rounded-2xl px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Avg Reaction
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {state.avgReactionMs}ms
                </p>
              </div>
              <div className="glass-surface rounded-2xl px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  P50 / P90
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {state.p50}ms / {state.p90}ms
                </p>
              </div>
              <div className="glass-surface rounded-2xl px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Hunt Rate
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {(state.huntRate * 100).toFixed(0)}%
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <GlassButton onClick={() => actions.resetSession()}>
                Start New Session
              </GlassButton>
              <GlassButton href="/progress" variant="secondary">
                View Progress
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      ) : null}
    </PageShell>
  );
}
