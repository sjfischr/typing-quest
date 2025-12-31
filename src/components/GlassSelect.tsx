"use client";

import type { SelectHTMLAttributes } from "react";

type GlassSelectOption = {
  value: string;
  label: string;
};

type GlassSelectProps = {
  options: GlassSelectOption[];
  className?: string;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "className">;

export default function GlassSelect({
  options,
  className,
  ...props
}: GlassSelectProps) {
  return (
    <select
      {...props}
      className={`rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-200/40 ${className ?? ""}`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value} className="text-black">
          {option.label}
        </option>
      ))}
    </select>
  );
}
