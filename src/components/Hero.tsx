"use client";

import { motion } from "framer-motion";
import ActionLink from "./ActionLink";

export default function Hero() {
  return (
    <motion.section
      className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]"
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0, y: 16 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.08 },
        },
      }}
    >
      <motion.div className="flex flex-col gap-6" variants={{ hidden: {}, show: {} }}>
        <span className="glass-chip w-fit">Liquid Glass Drills</span>
        <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
          Type through the glass. Track every pulse.
        </h1>
        <p className="text-lg text-white/70">
          Typing Quest blends a translucent glass UI with focused practice loops.
          Build speed, stay accurate, and watch your progress shimmer.
        </p>
        <div className="flex flex-wrap gap-4">
          <ActionLink href="/play" label="Start a Run" />
          <ActionLink href="/progress" label="View Progress" variant="ghost" />
        </div>
      </motion.div>
      <motion.div
        className="glass-panel flex flex-col gap-6 rounded-3xl p-6"
        variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-white/60">
            Quest Flow
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-white">
            Three loops. One clear rhythm.
          </h2>
        </div>
        <div className="space-y-4 text-sm text-white/70">
          <p>1. Pick a pack and lock into the cadence.</p>
          <p>2. Chase clean accuracy with every line.</p>
          <p>3. Log your best and return stronger.</p>
        </div>
      </motion.div>
    </motion.section>
  );
}
