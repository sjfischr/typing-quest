"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import GlassButton from "@/components/GlassButton";
import GlassCard from "@/components/GlassCard";
import GlassTabs from "@/components/GlassTabs";
import PageShell from "@/components/PageShell";
import RescueHud from "@/components/RescueHud";
import RescueStage from "@/components/RescueStage";
import GlassSelect from "@/components/GlassSelect";
import TypingPrompt from "@/components/TypingPrompt";
import { useRescueEngine } from "@/hooks/useRescueEngine";
import { recordRescueSession } from "@/lib/storage";
import { useEffect, useRef } from "react";
import { getStreakBonus } from "@/lib/rescueEngine";

export default function RescuePage() {
  const router = useRouter();
  const {
    state,
    input,
    metrics,
    meterPercent,
    healPulseId,
    errorPulseId,
    setDifficulty,
    handleInput,
    reset,
  } = useRescueEngine("medium");

  const timeLeftSec = Math.max(0, Math.round(state.timeLeftMs / 1000));
  const recordedRef = useRef(false);

  useEffect(() => {
    if (state.status === "won" || state.status === "lost") {
      if (recordedRef.current) return;
      recordedRef.current = true;
      recordRescueSession({
        mode: "rescue",
        createdAt: new Date().toISOString(),
        difficulty: state.difficulty,
        status: state.status,
        wordsCompleted: state.completed,
        wordGoal: state.wordGoal,
        durationMs: state.timeLeftMs,
        meterPeak: state.meterPeak,
        meterMax: state.meterMax,
        wpm: metrics?.wpm ?? 0,
        accuracy: metrics?.accuracy ?? 0,
      });
    } else {
      recordedRef.current = false;
    }
  }, [state.status, state.completed, state.wordGoal, state.timeLeftMs, state.meterPeak, state.meterMax, state.difficulty, metrics]);

  return (
    <PageShell>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          className="flex flex-col gap-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <GlassCard className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
                  Mode
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-white">
                  Crystal Rescue
                </h1>
                <p className="text-sm text-white/60">
                  Typing under time + error pressure. Keep the crystal platform intact.
                </p>
              </div>
            </div>
            <GlassTabs
              value="rescue"
              onChange={(next) => {
                if (next === "focus" || next === "sprint") {
                  router.push("/play");
                }
              }}
              items={[
                { id: "focus", label: "Focus", href: "/play" },
                { id: "sprint", label: "Sprint", href: "/play" },
                { id: "rescue", label: "Rescue" },
              ]}
            />
            <div className="grid gap-4 lg:grid-cols-2">
              <RescueStage
                target={state.target}
                meterPercent={meterPercent}
                healPulseId={healPulseId}
                shakeKey={errorPulseId}
              />
              <RescueHud
                meterValue={state.meter}
                meterMax={state.meterMax}
                timeLeftSec={timeLeftSec}
                wordsCompleted={state.completed}
                difficulty={state.difficulty.toUpperCase()}
                wpm={metrics?.wpm}
                accuracy={metrics?.accuracy}
                streak={state.streak}
                streakBonus={getStreakBonus(state.streak)}
              />
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_0.35fr]">
              <div className="space-y-3">
                <TypingPrompt target={state.target} input={input} />
                <textarea
                  value={input}
                  onChange={(event) => handleInput(event.target.value)}
                  placeholder={state.status === "won" ? "You won!" : state.status === "lost" ? "Crystal shattered" : "Type to rescue..."}
                  autoFocus
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  disabled={state.status === "won" || state.status === "lost"}
                  className="min-h-[120px] w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white/90 outline-none transition focus:border-cyan-200/40 focus:ring-2 focus:ring-cyan-200/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <span>
                    {state.status === "won"
                      ? "Run complete"
                      : state.status === "lost"
                        ? "Meter maxed — try again"
                        : `${timeLeftSec}s left · ${state.completed}/${state.wordGoal} words`}
                  </span>
                  <div className="flex gap-2">
                    <GlassButton
                      variant="ghost"
                      onClick={reset}
                      className="text-sm px-3 py-2"
                    >
                      Reset Run
                    </GlassButton>
                    <GlassButton
                      variant="secondary"
                      onClick={() => setDifficulty(state.difficulty)}
                      className="text-sm px-3 py-2"
                    >
                      Restart
                    </GlassButton>
                  </div>
                </div>
              </div>
              <GlassCard className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Difficulty
                </p>
                <GlassSelect
                  value={state.difficulty}
                  onChange={(event) => setDifficulty(event.target.value as "easy" | "medium" | "hard")}
                  aria-label="Select rescue difficulty"
                  options={[
                    { value: "easy", label: "Easy" },
                    { value: "medium", label: "Medium" },
                    { value: "hard", label: "Hard" },
                  ]}
                />
                <p className="text-sm text-white/70">
                  Meter grows from time + typos. Finish words to heal; streak 3+ clean words for bonus heal. Win by surviving the timer or hitting the word goal.
                </p>
              </GlassCard>
            </div>
            <div className="flex flex-wrap gap-3">
              <GlassButton href="/play" variant="secondary">
                Back to Play
              </GlassButton>
              <GlassButton variant="ghost" onClick={() => router.push("/") }>
                Return Home
              </GlassButton>
            </div>
          </GlassCard>
        </motion.div>
        <div className="flex flex-col gap-6">
          <GlassCard className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
              What will land here
            </p>
            <ul className="list-disc space-y-2 pl-5 text-sm text-white/70">
              <li>Crack meter with time and typo spikes.</li>
              <li>Mascot on a glass platform with crack/heal animations.</li>
              <li>Word flow sourced by difficulty (short words to long lines).</li>
              <li>HUD for timer, words completed, WPM, accuracy.</li>
            </ul>
          </GlassCard>
        </div>
      </div>
    </PageShell>
  );
}
