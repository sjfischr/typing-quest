"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

type GlassButtonVariant = "primary" | "secondary" | "ghost";

type GlassButtonProps = {
  variant?: GlassButtonVariant;
  href?: string;
  label?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const base =
  "inline-flex items-center justify-center rounded-2xl px-5 py-2 text-sm font-semibold uppercase tracking-widest transition focus:outline-none focus:ring-2 focus:ring-cyan-200/40";

const variants: Record<GlassButtonVariant, string> = {
  primary:
    "bg-white/15 text-white shadow-glow hover:bg-white/25 hover:shadow-glow",
  secondary:
    "bg-white/8 text-white/85 hover:bg-white/15 hover:text-white",
  ghost:
    "border border-white/15 text-white/75 hover:border-white/40 hover:text-white",
};

export default function GlassButton({
  variant = "primary",
  href,
  label,
  className,
  children,
  ...props
}: GlassButtonProps) {
  const content = children ?? label;
  const classes = `${base} ${variants[variant]} ${className ?? ""}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
