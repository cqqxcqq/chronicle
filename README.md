# Chronicle — CPM 2026

Chronicle is an interactive historical essay about humanity's real, uneven, and unfinished progress toward the Sustainable Development Goals.

## Experience

1. **Opening** — establishes the historical question.
2. **Timeline** — explores reconstructed global trends from 1800–2026.
3. **Your Life** — follows a fictional lineage across nine generations. Choices affect inherited health, knowledge, solidarity, and resilience; they do not alter global history.
4. **Unfinished Chapter** — asks the visitor to choose one SDG promise to carry forward.
5. **Evidence** — documents sources, definitions, uncertainty, methodology, and credits.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a competition build:

```bash
npm run lint
npm run build
npm start
```

The typography uses offline-safe system font stacks, so the production build does not depend on Google Fonts.

## Controls

- Scroll or swipe to move through the timeline.
- Drag the bottom timeline to select a year.
- Arrow keys jump between eras.
- Number keys select game choices.
- Space or Enter continues.
- Escape skips cinematic sequences.
- A sound toggle is available in the main navigation.

## Evidence and methodology

The Evidence page lists the World Bank, United Nations, and Our World in Data references used by the experience.

- Early global values are historical reconstructions and are deliberately rounded.
- Between milestone years, the interface interpolates values for visual continuity. These are not annual observations.
- Extreme poverty depends on the poverty line and purchasing-power methodology.
- Global averages hide major regional and social inequalities.
- Historical imagery is illustrative, not documentary proof of a specific scene.

## Before submission

- Replace this section with the creator/team name, school, CPM 2026 category, and contact.
- Record the creator, original source URL, and license for every image in `public/`.
- Test the full experience on the exact presentation device and without internet.
- Verify mobile layout, keyboard navigation, reduced-motion mode, sound-off mode, and projector contrast.

## Technology

Next.js 16, React 19, TypeScript, Framer Motion, CSS Modules, and Canvas.
