# Typing Quest - Project Context

## Overview
Typing Quest is a modern, engaging typing tutor designed for kids and learners. It features a "Liquid Glass" UI aesthetic, structured learning paths, and detailed progress tracking. The application is built with performance and visual appeal in mind, using the latest web technologies.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **State Management:** React Hooks (local state + custom hooks)
- **Storage:** LocalStorage (via `src/lib/storage.ts`)

## Core Features

### 1. Play Mode (Sprint)
- **Description:** Standard typing practice using predefined content packs.
- **Content:** Located in `src/content/packs.ts`.
  - *Aurora Drift:* Soft-focus prose.
  - *Circuit Sprint:* Short, punchy bursts.
  - *Nebula Stories:* Longer narratives.
- **Engine:** `src/lib/typingEngine.ts` calculates WPM, accuracy, and character states.

### 2. Play Mode (Rescue / Hangman-style)
- **Kid-friendly theme:** A glass mascot stands on a crystal platform. Cracks appear as danger rises; completing words repairs the platform. No gallows imagery.
- **Pressure model:** Combination of Time + Error pressure.
  - A "Crack Meter" rises over time; typos add larger spikes. Completing a word drains a chunk of the meter.
  - Lose when the meter fills and the crystal shatters (soft fail animation); win by surviving a duration or clearing N words.
- **Content:** Reuses `packs.ts` texts; consider shorter words for younger players (new pack optional).
- **Difficulty knobs:**
  - Easy: Slow time rise; typos add small cracks; generous meter drain on completion.
  - Medium: Moderate time rise; typos add medium cracks; standard drain.
  - Hard: Fast time rise; typos add large cracks; smaller drain.
- **Planned implementation shape (no code yet):**
  - Route: `src/app/play/rescue/page.tsx`.
  - Engine: `src/lib/rescueEngine.ts` to manage target selection, crack meter, streaks, and end-state.
  - UI: `RescueStage` component for mascot + crystal, crack overlays, heal glow, mild shake on errors.
  - HUD: Shows meter, words completed, time left, and live WPM/accuracy.
- **Metrics to track per run:** words completed, time survived, WPM, accuracy, typos, meter peak, difficulty.

### 3. Learn Mode
- **Description:** Structured lessons focusing on finger placement and reaction time.
- **Engine:** `src/lib/learnEngine.ts` manages difficulty levels (beginner, intermediate, advanced) and session logic.
- **Visuals:** `src/components/LearnKeyboard.tsx` provides an on-screen keyboard with finger guides.
- **Metrics:** Tracks "Hunt Rate" (time to find keys), reaction time, and shift key usage.

### 4. Progress Tracking
- **Storage:** Persists stats to LocalStorage.
- **Metrics:**
  - WPM (Words Per Minute)
  - Accuracy (%)
  - Session history
  - Detailed breakdown of reaction times and error rates.

## Project Structure

### `src/app`
- **`(home)/page.tsx`**: Landing page with "Quick Start" and stats preview.
- **`play/page.tsx`**: The main typing interface for content packs.
- **`learn/page.tsx`**: The structured learning interface.
- **`progress/page.tsx`**: Dashboard for viewing user statistics.
- **`settings/page.tsx`**: User configuration.
- **`layout.tsx`**: Root layout including the `AuroraBackground`.

### `src/components`
- **UI Primitives:** `GlassButton`, `GlassCard`, `GlassSelect`, `GlassTabs` (implementing the Liquid Glass design system).
- **Visuals:** `AuroraBackground` (animated background), `Hero`.
- **Functional:**
  - `TypingPrompt`: Displays text to type with real-time feedback.
  - `LearnKeyboard`: On-screen keyboard visualization.
  - `StatsPreview`, `StatPill`: Displaying metrics.

### `src/lib`
- **`typingEngine.ts`**: Core logic for calculating typing metrics (WPM, accuracy).
- **`learnEngine.ts`**: Logic for the learning mode, including finger mapping (`FINGER_MAP`) and target generation.
- **`storage.ts`**: Handles saving and loading user progress from LocalStorage.

### `src/hooks`
- **`useLearnEngine.ts`**: Custom hook managing the state of a learning session (timer, current target, score accumulation).

## Design System
- **Theme:** "Liquid Glass" - characterized by translucency, soft glows, and blurred backgrounds.
- **Colors:** Defined in Tailwind config, utilizing white/transparent layers over the Aurora background.
- **Typography:** Geist Sans and Geist Mono.

## Key Data Models
- **`TypingMetrics`**: `{ wpm, accuracy, correct, errors, durationMs, characters }`
- **`LearnSession`**: `{ mode, difficulty, totals, segments }`
- **`Pack`**: `{ id, title, description, texts }`
