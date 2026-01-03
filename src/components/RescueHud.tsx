"use client";

import GlassCard from "@/components/GlassCard";

export type RescueHudProps = {
  meterValue: number;
  meterMax: number;
  timeLeftSec: number;
  wordsCompleted: number;
  difficulty: string;
  wpm?: number;
  accuracy?: number;
  streak?: number;
  streakBonus?: number;
};

export default function RescueHud({
  meterValue,
  meterMax,
  timeLeftSec,
  wordsCompleted,
  difficulty,
  wpm,
  accuracy,
  streak,
  streakBonus,
}: RescueHudProps) {
  const meterPercent = Math.min(100, Math.max(0, Math.round((meterValue / meterMax) * 100)));
  const streakText = streakBonus && streakBonus > 0 ? `+${streakBonus} heal on next word` : "Chain 3+ clean words to earn heal";

  return (
    <GlassCard className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Rescue HUD
          </p>
          <p className="text-xs uppercase tracking-widest text-cyan-200/70">{difficulty}</p>
        </div>
        <div className="glass-surface rounded-2xl px-3 py-2 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Words</p>
          <p className="text-lg font-semibold text-white">{wordsCompleted}</p>
        </div>
      </div>
      <div className="glass-surface relative h-24 overflow-hidden rounded-2xl bg-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-cyan-400/10 to-transparent" />
        <div
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-400/60 via-cyan-300/70 to-cyan-200/60 transition-[height] duration-300"
          style={{ height: `${meterPercent}%` }}
          aria-label="Crack meter"
        />
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white/80">
          {meterPercent}%
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm text-white/80">
        <div className="glass-surface rounded-2xl px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Time Left</p>
          <p className="text-lg font-semibold text-white">{timeLeftSec}s</p>
        </div>
        <div className="glass-surface rounded-2xl px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Meter</p>
          <p className="text-lg font-semibold text-white">
            {meterValue} / {meterMax}
          </p>
        </div>
        <div className="glass-surface rounded-2xl px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">WPM</p>
          <p className="text-lg font-semibold text-white">{wpm ?? 0}</p>
        </div>
        <div className="glass-surface rounded-2xl px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Accuracy</p>
          <p className="text-lg font-semibold text-white">{accuracy ?? 100}%</p>
        </div>
        <div className="glass-surface rounded-2xl px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Streak</p>
          <p className="text-lg font-semibold text-white">{streak ?? 0}</p>
          <p className="text-[11px] text-white/60">{streakText}</p>
        </div>
        <div className="glass-surface rounded-2xl px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">Heal Bonus</p>
          <p className="text-lg font-semibold text-white">+{streakBonus ?? 0}</p>
        </div>
      </div>
    </GlassCard>
  );
}
