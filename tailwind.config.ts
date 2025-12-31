import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
    "./src/content/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0e1118",
        mist: "#e8edf6",
        haze: "#b8c0d6",
        aurora: "#72f6ff",
        plasma: "#b4a1ff",
        tide: "#65ffd0",
      },
      boxShadow: {
        glass:
          "0 18px 60px rgba(4, 10, 28, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.18)",
        glow: "0 0 25px rgba(114, 246, 255, 0.35)",
      },
      backgroundImage: {
        aurora:
          "radial-gradient(circle at 10% 20%, rgba(114, 246, 255, 0.18), transparent 40%), radial-gradient(circle at 80% 10%, rgba(180, 161, 255, 0.2), transparent 45%), radial-gradient(circle at 40% 80%, rgba(101, 255, 208, 0.18), transparent 55%)",
      },
      keyframes: {
        aurora: {
          "0%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(-2%, 1%, 0) scale(1.02)" },
          "100%": { transform: "translate3d(0, 0, 0) scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "120% 50%" },
        },
      },
      animation: {
        aurora: "aurora 18s ease-in-out infinite",
        shimmer: "shimmer 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
