"use client";

import { useState } from "react";
import GlassButton from "@/components/GlassButton";
import GlassCard from "@/components/GlassCard";
import Hero from "@/components/Hero";
import PageShell from "@/components/PageShell";
import StatsPreview from "@/components/StatsPreview";
import { loadStats, type TypingStats } from "@/lib/storage";

const focusCards = [
  {
    title: "Liquid Glass UI",
    copy: "Translucent panels keep you in flow with soft contrast and glow.",
  },
  {
    title: "Micro Progress",
    copy: "Every run updates WPM, accuracy, and session streaks instantly.",
  },
  {
    title: "Keyboard First",
    copy: "Designed for physical keyboards with no distractions or clicks.",
  },
];

export default function HomePage() {
  const [initialStats] = useState<TypingStats>(() => loadStats());

  return (
    <PageShell>
      <div className="flex flex-col gap-12">
        <Hero />
        <GlassCard className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
              Quick Start
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Ready for a clean sprint?
            </h2>
            <p className="text-sm text-white/70">
              Jump back in with a fresh run or continue where you left off.
            </p>
          </div>
            <div className="flex flex-wrap gap-3">
              <GlassButton href="/play">Start Sprint</GlassButton>
            {initialStats.sessions > 0 ? (
              <GlassButton href="/play" variant="secondary">
                Continue
              </GlassButton>
            ) : null}
          </div>
        </GlassCard>
        <GlassCard className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
              Live Snapshot
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Your current pulse.
            </h2>
          </div>
          <StatsPreview />
        </GlassCard>
        <div className="grid gap-6 lg:grid-cols-3">
          {focusCards.map((card) => (
            <GlassCard key={card.title} className="space-y-3">
              <h3 className="text-xl font-semibold text-white">{card.title}</h3>
              <p className="text-sm text-white/70">{card.copy}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
