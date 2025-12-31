import { getCharStates } from "@/lib/typingEngine";

type TypingPromptProps = {
  target: string;
  input: string;
};

export default function TypingPrompt({ target, input }: TypingPromptProps) {
  const states = getCharStates(target, input);

  return (
    <div className="rounded-2xl bg-white/5 p-4 text-lg leading-8 text-white/80">
      {target.split("").map((char, index) => {
        const state = states[index];
        const color =
          state === "correct"
            ? "text-white"
            : state === "incorrect"
              ? "text-red-300"
              : "text-white/40";
        return (
          <span key={`${char}-${index}`} className={color}>
            {char}
          </span>
        );
      })}
    </div>
  );
}
