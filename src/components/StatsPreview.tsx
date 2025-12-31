"use client";

import { useEffect, useState } from "react";
import StatPill from "./StatPill";
import { defaultStats, loadStats, type TypingStats } from "@/lib/storage";

export default function StatsPreview() {
  const [stats, setStats] = useState<TypingStats>(defaultStats);

  useEffect(() => {
    setStats(loadStats());
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatPill label="Sessions" value={`${stats.sessions}`} />
      <StatPill label="Best WPM" value={`${stats.bestWpm}`} />
      <StatPill label="Avg WPM" value={`${stats.averageWpm}`} />
      <StatPill label="Accuracy" value={`${stats.accuracy}%`} />
    </div>
  );
}
