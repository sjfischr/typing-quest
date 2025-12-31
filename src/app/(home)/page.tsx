import GlassCard from "@/components/GlassCard";
import Hero from "@/components/Hero";
import PageShell from "@/components/PageShell";
import StatsPreview from "@/components/StatsPreview";

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
  return (
    <PageShell>
      <div className="flex flex-col gap-12">
        <Hero />
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
