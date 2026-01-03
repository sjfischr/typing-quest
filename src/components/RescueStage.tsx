"use client";

import { motion } from "framer-motion";
import GlassCard from "@/components/GlassCard";

export type RescueStageProps = {
  target: string;
  meterPercent: number;
  healPulseId?: number;
  shakeKey?: number;
  className?: string;
};

export default function RescueStage({
  target,
  meterPercent,
  healPulseId,
  shakeKey,
  className,
}: RescueStageProps) {
  const crackOpacity = Math.min(0.8, 0.25 + meterPercent / 140);
  const shouldShake = typeof shakeKey === "number";
  const particleOpacity = Math.max(0.12, 0.46 - meterPercent / 220);

  return (
    <GlassCard className={`relative overflow-hidden ${className ?? ""}`}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-white/5" />
      <div className="relative flex flex-col gap-4 p-4">
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>Crystal Platform</span>
          <span>{meterPercent}% stable</span>
        </div>
        <div className="relative flex h-48 items-end justify-center">
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0.32 }}
            animate={{ opacity: particleOpacity, y: [0, -8, 0], x: [0, 2, -2, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            style={{
              backgroundImage:
                "radial-gradient(circle at 18% 78%, rgba(255,255,255,0.22) 0, transparent 18%), radial-gradient(circle at 44% 66%, rgba(163,246,255,0.26) 0, transparent 14%), radial-gradient(circle at 76% 72%, rgba(180,255,210,0.2) 0, transparent 13%), radial-gradient(circle at 60% 42%, rgba(255,255,255,0.16) 0, transparent 16%), radial-gradient(circle at 30% 30%, rgba(255,255,255,0.12) 0, transparent 12%)",
            }}
          />
          <motion.div
            key={healPulseId}
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.2, 0.6, 0] }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(163,255,255,0.25),transparent_45%)]" />
          </motion.div>
          <motion.div
            key={shakeKey}
            className="relative flex h-28 w-40 items-center justify-center rounded-3xl bg-white/10 backdrop-blur"
            animate={{
              scale: meterPercent > 85 ? 1.05 : 1,
              y: meterPercent > 85 ? -3 : 0,
              x: shouldShake ? [0, -2.5, 2.5, -2, 2, 0] : 0,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 22, duration: shouldShake ? 0.25 : 0.22 }}
          >
            <div className="absolute inset-x-6 bottom-2 h-1 rounded-full bg-white/30" />
            <div className="absolute inset-0 rounded-3xl border border-white/20" />
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-[6px] rounded-b-3xl bg-gradient-to-r from-cyan-300/60 via-emerald-300/60 to-cyan-200/60"
              animate={{ opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="relative flex flex-col items-center gap-2 text-white">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                className="drop-shadow-[0_0_18px_rgba(164,255,255,0.6)]"
                aria-label="Crystal buddy"
              >
                <defs>
                  <linearGradient id="faceGrad" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="rgba(230,255,255,0.95)" />
                    <stop offset="100%" stopColor="rgba(172,235,255,0.82)" />
                  </linearGradient>
                  <radialGradient id="glowGrad" cx="50%" cy="80%" r="60%">
                    <stop offset="0%" stopColor="rgba(163,255,255,0.55)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </radialGradient>
                </defs>
                <circle cx="40" cy="40" r="28" fill="url(#faceGrad)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.8" />
                <circle cx="40" cy="44" r="32" fill="url(#glowGrad)" />
                <circle cx="30" cy="32" r="3.2" fill="white" />
                <circle cx="50" cy="32" r="3.2" fill="white" />
                <rect x="30" y="46" width="20" height="3.8" rx="2" fill="rgba(255,255,255,0.85)" />
                <path
                  d="M28 37 C33 33, 47 33, 52 37"
                  stroke="rgba(255,255,255,0.7)"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M24 48 Q40 58 56 48"
                  stroke="rgba(163,255,255,0.4)"
                  strokeWidth="1.4"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
              <p className="text-xs uppercase tracking-widest text-white/70">Crystal buddy</p>
            </div>
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: crackOpacity,
                backgroundImage:
                  "repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0px, rgba(255,255,255,0.35) 1px, transparent 1px, transparent 12px), repeating-linear-gradient(45deg, rgba(255,255,255,0.25) 0px, rgba(255,255,255,0.25) 1px, transparent 1px, transparent 16px)",
              }}
            />
          </motion.div>
        </div>
        <div className="glass-surface rounded-2xl px-4 py-3 text-center text-white/80">
          <p className="text-xs uppercase tracking-widest text-white/60">Current Target</p>
          <p className="mt-1 text-lg font-semibold text-white">{target}</p>
        </div>
      </div>
    </GlassCard>
  );
}
