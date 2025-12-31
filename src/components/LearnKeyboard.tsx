"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HOME_KEYS, type FingerId } from "@/lib/learnEngine";

type LearnKeyboardProps = {
  targetKey: string;
  lastPressedKey: string | null;
  lastPressedCorrect: boolean | null;
  activeFingerId: FingerId;
  fingerTargetKey: string;
  shiftTargetKey?: "shift-left" | "shift-right";
  showFingerLabels?: boolean;
  className?: string;
};

type KeySpec = {
  label: string;
  code: string;
  unitWidth: number;
};

type RowSpec = KeySpec[];

const ROWS: RowSpec[] = [
  [
    { label: "`", code: "`", unitWidth: 1 },
    { label: "1", code: "1", unitWidth: 1 },
    { label: "2", code: "2", unitWidth: 1 },
    { label: "3", code: "3", unitWidth: 1 },
    { label: "4", code: "4", unitWidth: 1 },
    { label: "5", code: "5", unitWidth: 1 },
    { label: "6", code: "6", unitWidth: 1 },
    { label: "7", code: "7", unitWidth: 1 },
    { label: "8", code: "8", unitWidth: 1 },
    { label: "9", code: "9", unitWidth: 1 },
    { label: "0", code: "0", unitWidth: 1 },
    { label: "-", code: "-", unitWidth: 1 },
    { label: "=", code: "=", unitWidth: 1 },
    { label: "Backspace", code: "backspace", unitWidth: 2 },
  ],
  [
    { label: "Tab", code: "tab", unitWidth: 1.5 },
    { label: "Q", code: "q", unitWidth: 1 },
    { label: "W", code: "w", unitWidth: 1 },
    { label: "E", code: "e", unitWidth: 1 },
    { label: "R", code: "r", unitWidth: 1 },
    { label: "T", code: "t", unitWidth: 1 },
    { label: "Y", code: "y", unitWidth: 1 },
    { label: "U", code: "u", unitWidth: 1 },
    { label: "I", code: "i", unitWidth: 1 },
    { label: "O", code: "o", unitWidth: 1 },
    { label: "P", code: "p", unitWidth: 1 },
    { label: "[", code: "[", unitWidth: 1 },
    { label: "]", code: "]", unitWidth: 1 },
    { label: "\\", code: "\\", unitWidth: 1.5 },
  ],
  [
    { label: "Caps", code: "caps", unitWidth: 1.75 },
    { label: "A", code: "a", unitWidth: 1 },
    { label: "S", code: "s", unitWidth: 1 },
    { label: "D", code: "d", unitWidth: 1 },
    { label: "F", code: "f", unitWidth: 1 },
    { label: "G", code: "g", unitWidth: 1 },
    { label: "H", code: "h", unitWidth: 1 },
    { label: "J", code: "j", unitWidth: 1 },
    { label: "K", code: "k", unitWidth: 1 },
    { label: "L", code: "l", unitWidth: 1 },
    { label: ";", code: ";", unitWidth: 1 },
    { label: "'", code: "'", unitWidth: 1 },
    { label: "Enter", code: "enter", unitWidth: 2.25 },
  ],
  [
    { label: "Shift", code: "shift-left", unitWidth: 2.25 },
    { label: "Z", code: "z", unitWidth: 1 },
    { label: "X", code: "x", unitWidth: 1 },
    { label: "C", code: "c", unitWidth: 1 },
    { label: "V", code: "v", unitWidth: 1 },
    { label: "B", code: "b", unitWidth: 1 },
    { label: "N", code: "n", unitWidth: 1 },
    { label: "M", code: "m", unitWidth: 1 },
    { label: ",", code: ",", unitWidth: 1 },
    { label: ".", code: ".", unitWidth: 1 },
    { label: "/", code: "/", unitWidth: 1 },
    { label: "Shift", code: "shift-right", unitWidth: 2.25 },
  ],
  [
    { label: "Ctrl", code: "ctrl-left", unitWidth: 1.25 },
    { label: "Win", code: "win", unitWidth: 1.25 },
    { label: "Alt", code: "alt-left", unitWidth: 1.25 },
    { label: "Space", code: "space", unitWidth: 6 },
    { label: "Alt", code: "alt-right", unitWidth: 1.25 },
    { label: "Fn", code: "fn", unitWidth: 1.25 },
    { label: "Ctrl", code: "ctrl-right", unitWidth: 1.25 },
  ],
];

const toPercent = (value: number, total: number) =>
  `${(value / total) * 100}%`;

const KEY_UNIT_PX = 48;
const KEY_GAP_PX = 8;
const ROW_GAP_PX = 10;

const buildKeyLayout = () => {
  const rows = ROWS.map((row, rowIndex) => {
    let offset = 0;
    const keys = row.map((key) => {
      const width = key.unitWidth * KEY_UNIT_PX + (key.unitWidth - 1) * KEY_GAP_PX;
      const x = offset;
      offset += width + KEY_GAP_PX;
      return {
        ...key,
        x,
        y: rowIndex * (KEY_UNIT_PX + ROW_GAP_PX),
        width,
        height: KEY_UNIT_PX,
      };
    });
    return { keys, width: offset - KEY_GAP_PX };
  });

  const maxWidth = Math.max(...rows.map((row) => row.width));
  const totalHeight =
    rows.length * KEY_UNIT_PX + (rows.length - 1) * ROW_GAP_PX;

  return { rows, maxWidth, totalHeight };
};

const KEYBOARD_LAYOUT = buildKeyLayout();

type KeyRect = { x: number; y: number; width: number; height: number };

const getKeyOrFallback = (code: string): KeyRect => {
  const key = KEYBOARD_LAYOUT.rows
    .flatMap((row) => row.keys)
    .find((item) => item.code === code);
  if (!key) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  return { x: key.x, y: key.y, width: key.width, height: key.height };
};

const FINGER_IDS: FingerId[] = [
  "leftPinky",
  "leftRing",
  "leftMiddle",
  "leftIndex",
  "rightIndex",
  "rightMiddle",
  "rightRing",
  "rightPinky",
];

const HOME_KEY_POSITION = FINGER_IDS.reduce<Record<FingerId, KeyRect>>(
  (acc, fingerId) => {
    acc[fingerId] = getKeyOrFallback(HOME_KEYS[fingerId]);
    return acc;
  },
  {} as Record<FingerId, KeyRect>
);

const FINGER_LABELS: Record<FingerId, string> = {
  leftPinky: "L P",
  leftRing: "L R",
  leftMiddle: "L M",
  leftIndex: "L I",
  rightIndex: "R I",
  rightMiddle: "R M",
  rightRing: "R R",
  rightPinky: "R P",
};

const getKeyByCode = (code: string) =>
  KEYBOARD_LAYOUT.rows.flatMap((row) => row.keys).find((item) => item.code === code);

const getKeyCenter = (key?: { x: number; y: number; width: number; height: number }) => {
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
  activeFingerId,
  fingerTargetKey,
  shiftTargetKey,
  showFingerLabels = false,
  className,
}: LearnKeyboardProps) {
  const reduceMotion = useReducedMotion();
  const targetKeySpec = getKeyByCode(targetKey);
  const pressedKeySpec = lastPressedKey ? getKeyByCode(lastPressedKey) : undefined;
  const homeOutlines = Object.values(HOME_KEYS)
    .map((key) => getKeyByCode(key))
    .filter((key): key is NonNullable<typeof key> => Boolean(key));

  return (
    <div
      className={`learn-keyboard relative mx-auto w-full max-w-5xl ${className ?? ""}`}
      style={{ aspectRatio: `${KEYBOARD_LAYOUT.maxWidth} / ${KEYBOARD_LAYOUT.totalHeight}` }}
    >
      <div className="absolute inset-0 rounded-3xl bg-white/5 shadow-glass" />
      {homeOutlines.map((key) => (
        <div
          key={`home-${key.code}`}
          className="absolute rounded-2xl border border-white/25 ring-1 ring-white/10"
          style={{
            left: toPercent(key.x, KEYBOARD_LAYOUT.maxWidth),
            top: toPercent(key.y, KEYBOARD_LAYOUT.totalHeight),
            width: toPercent(key.width, KEYBOARD_LAYOUT.maxWidth),
            height: toPercent(key.height, KEYBOARD_LAYOUT.totalHeight),
          }}
        />
      ))}
      {KEYBOARD_LAYOUT.rows.map((row) =>
        row.keys.map((key) => {
          const isTarget = targetKeySpec?.code === key.code;
          const isPressed = pressedKeySpec?.code === key.code;
          const pressedClass = isPressed
            ? lastPressedCorrect
              ? "bg-emerald-200/25 ring-1 ring-emerald-200/40"
              : "bg-rose-200/20 ring-1 ring-rose-200/40"
            : "bg-white/5";
          const shiftRing =
            shiftTargetKey && key.code === shiftTargetKey
              ? "ring-2 ring-white/40"
              : "";
          const targetRing = isTarget ? "ring-2 ring-cyan-200/50" : "";
          return (
            <div
              key={`${key.code}-${key.x}`}
              className={`absolute rounded-2xl border border-white/15 text-[10px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur-md ${pressedClass} ${targetRing} ${shiftRing}`}
              style={{
                left: toPercent(key.x, KEYBOARD_LAYOUT.maxWidth),
                top: toPercent(key.y, KEYBOARD_LAYOUT.totalHeight),
                width: toPercent(key.width, KEYBOARD_LAYOUT.maxWidth),
                height: toPercent(key.height, KEYBOARD_LAYOUT.totalHeight),
              }}
            >
              <span className="flex h-full w-full items-center justify-center">
                {key.label}
              </span>
            </div>
          );
        })
      )}

      {FINGER_IDS.map((fingerId) => {
        const homeKey = HOME_KEY_POSITION[fingerId];
        const isActive = fingerId === activeFingerId;
        const destinationKey =
          isActive && fingerTargetKey ? getKeyByCode(fingerTargetKey) : homeKey;
        const center = getKeyCenter(destinationKey);
        const fingerWidth = 26;
        const fingerHeight = 64;
        const x = center.x - fingerWidth / 2;
        const y = center.y - fingerHeight - 6;
        const label = FINGER_LABELS[fingerId];
        return (
          <motion.div
            key={fingerId}
            className={`absolute rounded-full border border-white/30 bg-white/15 shadow-glow ${
              isActive ? "opacity-90" : "opacity-45"
            }`}
            animate={{
              left: toPercent(x, KEYBOARD_LAYOUT.maxWidth),
              top: toPercent(y, KEYBOARD_LAYOUT.totalHeight),
              width: toPercent(fingerWidth, KEYBOARD_LAYOUT.maxWidth),
              height: toPercent(fingerHeight, KEYBOARD_LAYOUT.totalHeight),
              scale: isActive && !reduceMotion ? [1, 1.08, 1] : 1,
              opacity: isActive && !reduceMotion ? [0.75, 1, 0.75] : undefined,
            }}
            transition={{
              duration: reduceMotion ? 0 : 0.9,
              ease: "easeOut",
              repeat: isActive && !reduceMotion ? Infinity : 0,
            }}
          >
            {showFingerLabels ? (
              <span className="flex h-full w-full items-center justify-center text-[9px] font-semibold uppercase tracking-widest text-white/80">
                {label}
              </span>
            ) : null}
          </motion.div>
        );
      })}
    </div>
  );
}
