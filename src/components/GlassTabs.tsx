"use client";

import { useRouter } from "next/navigation";

type GlassTabsItem = {
  id: string;
  label: string;
  href?: string;
};

type GlassTabsProps = {
  items: GlassTabsItem[];
  value: string;
  onChange?: (value: string) => void;
  className?: string;
};

export default function GlassTabs({
  items,
  value,
  onChange,
  className,
}: GlassTabsProps) {
  const router = useRouter();

  const handleClick = (item: GlassTabsItem) => {
    if (item.href) {
      router.push(item.href);
      return;
    }
    if (onChange) {
      onChange(item.id);
    }
  };

  return (
    <div
      role="tablist"
      aria-label="Typing mode"
      className={`glass-surface flex items-center gap-2 rounded-2xl p-2 ${className ?? ""}`}
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            role="tab"
            aria-selected={active}
            className={`rounded-2xl px-4 py-2 text-xs font-semibold uppercase tracking-widest transition ${
              active
                ? "bg-white/20 text-white shadow-glow"
                : "text-white/60 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
