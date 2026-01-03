"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import PageShell from "@/components/PageShell";
import GlassCard from "@/components/GlassCard";
import TypingPrompt from "@/components/TypingPrompt";
import GlassButton from "@/components/GlassButton";
import GlassSelect from "@/components/GlassSelect";
import GlassTabs from "@/components/GlassTabs";
import { packs } from "@/content/packs";
import {
  calculateMetrics,
  clampInput,
  type TypingMetrics,
} from "@/lib/typingEngine";
import { loadStats, recordSession, type TypingStats } from "@/lib/storage";

export default function PlayPage() {
  const router = useRouter();
  const [mode, setMode] = useState("focus");
  const [packId, setPackId] = useState(packs[0]?.id ?? "");
  const [sampleIndex, setSampleIndex] = useState(0);
  const [input, setInput] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [complete, setComplete] = useState(false);
  const [metrics, setMetrics] = useState<TypingMetrics | null>(null);
  const [stats, setStats] = useState<TypingStats>(() => loadStats());

  const activePack = useMemo(
    () => packs.find((pack) => pack.id === packId) ?? packs[0],
    [packId]
  );
  const target = activePack.texts[sampleIndex];

  useEffect(() => {
    if (!startedAt || complete) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedMs(Date.now() - startedAt);
    }, 200);

    return () => window.clearInterval(interval);
  }, [startedAt, complete]);

  const resetRun = () => {
    setInput("");
    setStartedAt(null);
    setElapsedMs(0);
    setComplete(false);
    setMetrics(null);
  };

  const nextSample = () => {
    resetRun();
    setSampleIndex((prev) => (prev + 1) % activePack.texts.length);
  };

  const handleInput = (value: string) => {
    if (complete) {
      return;
    }

    const nextValue = clampInput(value, target);
    const startTime = startedAt ?? Date.now();
    if (!startedAt && nextValue.length > 0) {
      setStartedAt(startTime);
    }
    setInput(nextValue);

    const duration = Date.now() - startTime;
    if (startedAt || nextValue.length > 0) {
      setElapsedMs(duration);
    }
    const nextMetrics = calculateMetrics(target, nextValue, duration);
    setMetrics(nextMetrics);

    if (nextValue === target) {
      setComplete(true);
      const updatedStats = recordSession(nextMetrics);
      setStats(updatedStats);
    }
  };

  return (
    <PageShell>
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex justify-between gap-4">
          <div className="text-sm uppercase tracking-widest text-cyan-100/80">Play</div>
          <GlassButton href="/play/rescue" variant="ghost" className="text-xs uppercase tracking-widest">
            New: Rescue Mode
          </GlassButton>
        </div>
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
                  Pack
                </p>
                <h1 className="text-2xl font-semibold text-white">
                  {activePack.title}
                </h1>
                <p className="text-sm text-white/60">{activePack.description}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <GlassSelect
                  value={packId}
                  onChange={(event) => {
                    setPackId(event.target.value);
                    setSampleIndex(0);
                    resetRun();
                  }}
                  aria-label="Select typing pack"
                  options={packs.map((pack) => ({
                    value: pack.id,
                    label: pack.title,
                  }))}
                />
                <GlassButton
                  href="/play/rescue"
                  variant="secondary"
                  className="whitespace-nowrap"
                >
                  Try Rescue
                </GlassButton>
              </div>
            </div>
            <GlassTabs
              value={mode}
              onChange={(next) => {
                if (next === "rescue") {
                  router.push("/play/rescue");
                  return;
                }
                setMode(next);
              }}
              items={[
                { id: "focus", label: "Focus" },
                { id: "sprint", label: "Sprint" },
                { id: "rescue", label: "Rescue", href: "/play/rescue" },
              ]}
            />
            <TypingPrompt target={target} input={input} />
            <div className="flex flex-wrap items-center gap-3">
              <textarea
                value={input}
                onChange={(event) => handleInput(event.target.value)}
                placeholder="Start typing here..."
                autoFocus
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                className="min-h-[110px] w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-base text-white/90 outline-none transition focus:border-cyan-200/40 focus:ring-2 focus:ring-cyan-200/20"
              />
              <div className="flex w-full items-center justify-between gap-4 text-sm text-white/70">
                <span>
                  {Math.floor(elapsedMs / 1000)}s elapsed ·{" "}
                  {input.length}/{target.length} chars
                </span>
                {complete ? (
                  <span className="text-emerald-200">Run complete.</span>
                ) : (
                  <span>Keep the rhythm.</span>
                )}
              </div>
            </div>
          </GlassCard>
          <div className="flex flex-wrap gap-3">
            <GlassButton onClick={resetRun} variant="ghost">
              Reset Run
            </GlassButton>
            <GlassButton onClick={nextSample} variant="secondary">
              Next Sample
            </GlassButton>
          </div>
        </motion.div>
        <div className="flex flex-col gap-6">
          <GlassCard className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
              Live Metrics
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="glass-surface rounded-2xl px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  WPM
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {metrics?.wpm ?? 0}
                </p>
              </div>
              <div className="glass-surface rounded-2xl px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Accuracy
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {metrics?.accuracy ?? 100}%
                </p>
              </div>
              <div className="glass-surface rounded-2xl px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Errors
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {metrics?.errors ?? 0}
                </p>
              </div>
              <div className="glass-surface rounded-2xl px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Characters
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {metrics?.characters ?? 0}
                </p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
              Lifetime Stats
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="glass-surface rounded-2xl px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Sessions
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {stats.sessions}
                </p>
              </div>
              <div className="glass-surface rounded-2xl px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Best WPM
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {stats.bestWpm}
                </p>
              </div>
              <div className="glass-surface rounded-2xl px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Avg WPM
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {stats.averageWpm}
                </p>
              </div>
              <div className="glass-surface rounded-2xl px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                  Accuracy
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {stats.accuracy}%
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageShell>
  );
}
