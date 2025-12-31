"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { href: "/play", label: "Sprint" },
  { href: "/learn", label: "Learn" },
  { href: "/progress", label: "Progress" },
  { href: "/settings", label: "Settings" },
];

type PageShellProps = {
  children: React.ReactNode;
};

export default function PageShell({ children }: PageShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen px-6 pb-16 pt-8 sm:px-10">
      <motion.header
        className="glass-panel mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl px-6 py-4"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Link href="/" className="flex items-center gap-3">
          <span className="glass-chip">Typing Quest</span>
        </Link>
        <nav className="glass-surface flex items-center gap-2 rounded-2xl p-1 text-xs font-semibold uppercase tracking-widest">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-4 py-2 transition ${
                  active
                    ? "bg-white/15 text-white shadow-glow"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </motion.header>
      <main className="mx-auto mt-10 w-full max-w-6xl">{children}</main>
    </div>
  );
}
