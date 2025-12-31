"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/PageShell";
import GlassCard from "@/components/GlassCard";
import StatPill from "@/components/StatPill";
import {
  defaultStats,
  loadLearnSessions,
  loadStats,
  type TypingStats,
} from "@/lib/storage";
import type { LearnSession } from "@/lib/learnEngine";

const formatDate = (value: string | null) => {
  if (!value) {
    return "No runs yet";
  }
  const date = new Date(value);
  return date.toLocaleString();
};

export default function ProgressPage() {
  const [stats, setStats] = useState<TypingStats>(defaultStats);
  const [learnSessions, setLearnSessions] = useState<LearnSession[]>([]);

  useEffect(() => {
    setStats(loadStats());
    setLearnSessions(loadLearnSessions());
  }, []);

  const bestLearnAccuracy = learnSessions.reduce((best, session) => {
    const total = session.totals.correctTargets + session.totals.wrongKeyPresses;
    const accuracy = total === 0 ? 0 : (session.totals.correctTargets / total) * 100;
    return Math.max(best, accuracy);
  }, 0);

  const bestLearnReaction = learnSessions.reduce((best, session) => {
    if (session.totals.avgReactionMs === 0) {
      return best;
    }
    return best === 0
      ? session.totals.avgReactionMs
      : Math.min(best, session.totals.avgReactionMs);
  }, 0);

  const recentLearnSessions = learnSessions.slice(0, 10);

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
        <GlassCard className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
              Learn the Keys
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Reaction focus stats
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatPill
              label="Best Accuracy"
              value={`${bestLearnAccuracy.toFixed(0)}%`}
            />
            <StatPill
              label="Best Reaction"
              value={bestLearnReaction ? `${bestLearnReaction}ms` : "—"}
            />
            <StatPill
              label="Sessions"
              value={`${learnSessions.length}`}
            />
            <StatPill
              label="Last Session"
              value={
                learnSessions[0]?.createdAt
                  ? formatDate(learnSessions[0].createdAt)
                  : "No runs yet"
              }
            />
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <div className="grid grid-cols-4 gap-2 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-widest text-white/60">
              <span>Date</span>
              <span>Difficulty</span>
              <span>Accuracy</span>
              <span>Avg Reaction</span>
            </div>
            {recentLearnSessions.length === 0 ? (
              <div className="px-4 py-6 text-sm text-white/60">
                Complete a Learn session to see history here.
              </div>
            ) : (
              recentLearnSessions.map((session) => {
                const total =
                  session.totals.correctTargets + session.totals.wrongKeyPresses;
                const accuracy =
                  total === 0
                    ? 0
                    : Math.round(
                        (session.totals.correctTargets / total) * 100
                      );
                return (
                  <div
                    key={session.createdAt}
                    className="grid grid-cols-4 gap-2 px-4 py-3 text-sm text-white/80 odd:bg-white/0 even:bg-white/5"
                  >
                    <span>{formatDate(session.createdAt)}</span>
                    <span className="capitalize">{session.difficulty}</span>
                    <span>{accuracy}%</span>
                    <span>{session.totals.avgReactionMs}ms</span>
                  </div>
                );
              })
            )}
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}
