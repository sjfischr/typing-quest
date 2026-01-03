# TODO - Rescue Mode (Crystal Rescue)

## High-Level
- [x] Define UX flow: entry point from Home/Play, mode selection UX, restart behavior.
  - Entry points:
    - Home "Quick Start" secondary button links to Play tab with Rescue preselected (or a dedicated "Try Rescue" pill).
    - Play page tabs: add "Rescue" alongside existing modes; default stays on current focus mode.
  - Mode selection UX:
    - Tabs or segmented control at top of Play card: Focus (existing), Rescue (new), Learn keeps separate page.
    - Difficulty picker inside Rescue card (Easy/Medium/Hard) with short copy on pressure model.
  - Restart behavior:
    - Show "Restart" and "Next word" controls in-result state; restart resets meter, timer, streak.
    - On lose: soft fail copy, offer "Try again" primary and "Back to packs" secondary.
    - On win: show stats summary + "Run it back" CTA.
- [x] Lock in visual language: mascot, crystal platform, crack/heal animations, meter style; keep Liquid Glass aesthetic.
  - Mascot: friendly glass sprite with soft glow outline; no sharp edges; idle sway and subtle blink.
  - Platform: translucent crystal slab with frosted blur; edge light that pulses with progress.
  - Cracks: thin white hairlines with light scatter; animate in with quick fractal growth; fade slightly on heal.
  - Heal: radial soft cyan/teal glow ripple from center on word complete; small particle specks rising.
  - Meter: vertical glass tube or arc bar with gradient fill; spikes for typo events; calm breathing animation when low.
  - Error feedback: gentle card shake + brief pink tint on platform rim; avoid harsh flashes.
  - Success feedback: platform brightens briefly; mascot hop; crack opacity reduced.
  - Background: reuse Aurora; slightly brighten behind platform on streaks to reinforce flow.
- [x] Decide content length per difficulty (word lists vs. packs) and session length/win condition.
  - Content source:
    - Easy: short words/mini-phrases (3–6 chars, 1–2 words); create a kid-friendly short list pack; allow trimmed existing `packs.ts` lines.
    - Medium: standard `packs.ts` lines as-is.
    - Hard: standard packs plus occasional longer lines; optional bursts of short words to spike pace.
  - Session length / win condition:
    - Duration: 120s (aligned with Learn) or 20 words, whichever comes first; show both counters.
    - Win: meter never fills before duration/word quota completes.
    - Lose: meter fills (time + typo spikes).
  - Meter tuning by difficulty:
    - Easy: slow passive fill; small typo spike; generous heal per completion.
    - Medium: moderate passive fill; medium spike; standard heal.
    - Hard: fast passive fill; large spike; smaller heal.

## Engineering
- [x] Create route `src/app/play/rescue/page.tsx` and wire navigation from Play tabs/buttons.
  - Added page scaffold with tabs highlighting Rescue; routes back to Play for Focus/Sprint.
  - Play tabs now include a Rescue entry that navigates to the new route.
- [ ] Add UI components:
  - [x] Scaffolded `RescueHud` and `RescueStage` placeholders (meter, target display, mascot slot).
  - [x] Added crack overlay, heal pulse, shake feedback on errors, particles, and simple mascot art.
  - [x] Bind live data from rescue engine for meter/targets.
  - [x] Refined particles and mascot asset (inline SVG); could still swap for production art later.
- [ ] Implement `src/lib/rescueEngine.ts`:
  - [x] Difficulty configs, meter state, time/typo/complete transitions, target selection (with easy short list).
  - [x] Wired to UI with `useRescueEngine` hook; tuned passive/typo/heal and streak bonus.
  - [x] Storage logging added for rescue runs (status, peak meter, words, WPM/accuracy).
  - [x] Final pass tuning (passive fill down slightly), streak bonus exposed in HUD and page copy.
- [x] Tie into storage: record runs (new record type) alongside existing stats.
- [x] Add difficulty presets (Easy/Medium/Hard) mapping to engine tuning constants.

## UX/Polish
- [ ] Kid-friendly feedback: no violent imagery; soft fail animation; encouraging copy on lose.
- [ ] Sounds/vibes: subtle success chime, muted error tick (respect reduced-motion/audio opt-out).
- [ ] Accessibility: reduced motion support, color contrast for meter/cracks, keyboard-only flow.

## QA / Acceptance
- [ ] Time pressure + error pressure both active; meter behavior matches difficulty.
- [ ] Completing a word visibly repairs cracks and lowers the meter.
- [ ] Typos immediately show feedback and spike the meter.
- [ ] Run ends correctly on win/lose; stats recorded.
- [ ] Works on mobile + desktop; reduced-motion path tested.
