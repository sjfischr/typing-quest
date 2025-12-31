type GlassCardProps = {
  className?: string;
  children: React.ReactNode;
};

export default function GlassCard({ className, children }: GlassCardProps) {
  return (
    <div className={`glass-panel rounded-3xl p-6 ${className ?? ""}`}>
      {children}
    </div>
  );
}
