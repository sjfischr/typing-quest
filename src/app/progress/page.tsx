"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";
import GlassCard from "@/components/GlassCard";
import StatPill from "@/components/StatPill";
import { defaultStats, loadStats, type TypingStats } from "@/lib/storage";

const formatDate = (value: string | null) => {
  if (!value) {
    return "No runs yet";
  }
  const date = new Date(value);
  return date.toLocaleString();
};

export default function ProgressPage() {
  const [stats, setStats] = useState<TypingStats>(defaultStats);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  return (
    <PageShell>
      <div className="flex flex-col gap-8">
        <GlassCard className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Progress Overview
          </p>
          <h1 className="text-3xl font-semibold text-white">Your Quest Log</h1>
          <p className="text-white/70">
            Every completed run updates these totals. Keep your cadence steady and
            watch the numbers climb.
          </p>
        </GlassCard>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatPill label="Sessions" value={`${stats.sessions}`} />
          <StatPill label="Best WPM" value={`${stats.bestWpm}`} />
          <StatPill label="Avg WPM" value={`${stats.averageWpm}`} />
          <StatPill label="Accuracy" value={`${stats.accuracy}%`} />
        </div>
        <GlassCard className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Detail
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="glass-surface rounded-2xl px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Total Characters
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {stats.totalCharacters}
              </p>
            </div>
            <div className="glass-surface rounded-2xl px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Last Played
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {formatDate(stats.lastPlayed)}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}
