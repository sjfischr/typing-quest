"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FINGER_MAP, HOME_KEYS, type FingerId } from "@/lib/learnEngine";

type LearnKeyboardProps = {
  targetKey: string;
  lastPressedKey: string | null;
  lastPressedCorrect: boolean | null;
};

type KeySpec = {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const KEY_WIDTH = 48;
const KEY_HEIGHT = 48;
const KEY_GAP = 10;
const ROW_GAP = 12;
const ROW_OFFSETS = [0, 24, 48];

const rows = ["qwertyuiop", "asdfghjkl", "zxcvbnm"];

const buildKeys = (): KeySpec[] => {
  const keys: KeySpec[] = [];
  rows.forEach((row, rowIndex) => {
    const offset = ROW_OFFSETS[rowIndex] ?? 0;
    row.split("").forEach((label, index) => {
      keys.push({
        label,
        x: offset + index * (KEY_WIDTH + KEY_GAP),
        y: rowIndex * (KEY_HEIGHT + ROW_GAP),
        width: KEY_WIDTH,
        height: KEY_HEIGHT,
      });
    });
  });
  return keys;
};

const KEYS = buildKeys();
const BASE_WIDTH = 10 * KEY_WIDTH + 9 * KEY_GAP;
const BASE_HEIGHT = 3 * KEY_HEIGHT + 2 * ROW_GAP;

const toPercent = (value: number, total: number) =>
  `${(value / total) * 100}%`;

const KEY_LOOKUP = KEYS.reduce<Record<string, KeySpec>>((acc, key) => {
  acc[key.label] = key;
  return acc;
}, {});

const fingerList: FingerId[] = [
  "leftPinky",
  "leftRing",
  "leftMiddle",
  "leftIndex",
  "rightIndex",
  "rightMiddle",
  "rightRing",
  "rightPinky",
];

const getKeyCenter = (key?: KeySpec) => {
  if (!key) {
    return { x: 0, y: 0 };
  }
  return {
    x: key.x + key.width / 2,
    y: key.y + key.height / 2,
  };
};

export default function LearnKeyboard({
  targetKey,
  lastPressedKey,
  lastPressedCorrect,
}: LearnKeyboardProps) {
  const reduceMotion = useReducedMotion();
  const targetFinger = FINGER_MAP[targetKey];

  return (
    <div className="relative mx-auto w-full max-w-3xl aspect-[560/210]">
      <div className="absolute inset-0 rounded-3xl bg-white/5 shadow-glass" />
      {KEYS.map((key) => {
        const isTarget = key.label === targetKey;
        const isPressed = key.label === lastPressedKey;
        const pressedClass = isPressed
          ? lastPressedCorrect
            ? "bg-emerald-200/25 ring-1 ring-emerald-200/40"
            : "bg-rose-200/20 ring-1 ring-rose-200/40"
          : "bg-white/5";
        const targetRing = isTarget ? "ring-2 ring-cyan-200/50" : "";

        return (
          <div
            key={key.label}
            className={`absolute rounded-2xl border border-white/15 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-md ${pressedClass} ${targetRing}`}
            style={{
              left: toPercent(key.x, BASE_WIDTH),
              top: toPercent(key.y, BASE_HEIGHT),
              width: toPercent(key.width, BASE_WIDTH),
              height: toPercent(key.height, BASE_HEIGHT),
            }}
          >
            <span className="flex h-full w-full items-center justify-center">
              {key.label}
            </span>
          </div>
        );
      })}
      {fingerList.map((finger) => {
        const homeKey = KEY_LOOKUP[HOME_KEYS[finger]];
        const targetKeySpec = KEY_LOOKUP[targetKey];
        const targetIsThisFinger = targetFinger === finger;
        const destination = targetIsThisFinger ? targetKeySpec : homeKey;
        const center = getKeyCenter(destination);
        const fingerWidth = 28;
        const fingerHeight = 72;
        const x = center.x - fingerWidth / 2;
        const y = center.y - fingerHeight - 8;

        return (
          <motion.div
            key={finger}
            className={`absolute rounded-full bg-white/10 shadow-glow ${
              targetIsThisFinger ? "opacity-80" : "opacity-35"
            }`}
            animate={{
              left: toPercent(x, BASE_WIDTH),
              top: toPercent(y, BASE_HEIGHT),
              width: toPercent(fingerWidth, BASE_WIDTH),
              height: toPercent(fingerHeight, BASE_HEIGHT),
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.18,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}
