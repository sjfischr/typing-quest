type StatPillProps = {
  label: string;
  value: string;
};

export default function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="glass-surface flex flex-col gap-1 rounded-2xl px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
        {label}
      </span>
      <span className="text-lg font-semibold text-white">{value}</span>
    </div>
  );
}
