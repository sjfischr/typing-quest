"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type ActionLinkProps = {
  href: string;
  label: string;
  variant?: "primary" | "ghost";
};

export default function ActionLink({
  href,
  label,
  variant = "primary",
}: ActionLinkProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-widest transition";
  const styles =
    variant === "primary"
      ? "bg-white/15 text-white shadow-glow hover:bg-white/25"
      : "border border-white/15 text-white/80 hover:text-white hover:border-white/40";

  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
      <Link href={href} className={`${base} ${styles}`}>
        {label}
      </Link>
    </motion.div>
  );
}
