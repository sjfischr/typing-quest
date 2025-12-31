"use client";

import { useState } from "react";
import PageShell from "@/components/PageShell";
import GlassCard from "@/components/GlassCard";
import { defaultStats, resetStats, type TypingStats } from "@/lib/storage";

export default function SettingsPage() {
  const [stats, setStats] = useState<TypingStats>(defaultStats);

  const handleReset = () => {
    setStats(resetStats());
  };

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <GlassCard className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Settings
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Tune the experience.
          </h1>
          <p className="text-white/70">
            Typing Quest is fully local and keyboard-first. Use this panel to
            clear stored progress or revisit defaults.
          </p>
        </GlassCard>
        <GlassCard className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Local Storage
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-lg font-semibold text-white">Reset stats</p>
              <p className="text-sm text-white/60">
                Clears all stored sessions and performance metrics.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold uppercase tracking-widest text-white/80 transition hover:border-white/40 hover:text-white"
            >
              Clear Progress
            </button>
          </div>
          <p className="text-xs text-white/50">
            Current sessions tracked: {stats.sessions}
          </p>
        </GlassCard>
      </div>
    </PageShell>
  );
}
