# Dog Name Generator

A pet-name browsing tool built with React 19, Vite, Tailwind CSS v4, Zustand, and Motion (formerly Framer Motion).

Users can scroll through hundreds of dog names using a wheel-picker interface, filter by gender, category, and starting letter, and view the meaning of each name.

## Features

- Animated wheel-picker with mouse-wheel, keyboard (↑ ↓), and swipe navigation
- Gender filter (Male / Female / Both)
- Category filter groups with animated dropdown panels
- Alphabet quick-jump
- Name details panel with etymology/definition and share actions
- Responsive layout — works on mobile and desktop
- Loading screen with animated spinner
- Error screen with retry action
- Fully accessible: ARIA `listbox`/`option` roles, keyboard navigation, focus rings

## Tech Stack

| Layer            | Library                          |
| ---------------- | -------------------------------- |
| UI framework     | React 19 + TypeScript            |
| Build tool       | Vite 8                           |
| Styling          | Tailwind CSS v4                  |
| State management | Zustand 5                        |
| Animations       | Motion (Framer Motion)           |
| Icons            | Lucide React                     |
| Compiler         | React Compiler (via Babel)       |
| Tests            | Vitest + Testing Library + jsdom |

## Setup

### Prerequisites

- **Node.js** ≥ 20.19 (Vite 8 requirement)
- **pnpm** ≥ 9 (recommended).

### Install & run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

### Scripts

| Command                | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `pnpm dev`             | Start dev server with HMR                       |
| `pnpm build`           | Type-check (`tsc -b`) and build for production  |
| `pnpm preview`         | Preview the production build                    |
| `pnpm lint`            | ESLint                                          |
| `pnpm format`          | Prettier (write)                                |
| `pnpm format:check`    | Prettier (check only)                           |
| `pnpm test`            | Run Vitest test suite                           |
| `pnpm test:ui`         | Run Vitest with the interactive UI              |
| `pnpm storybook`       | Start Storybook dev server on port 6006         |
| `pnpm build-storybook` | Build a static Storybook to `storybook-static/` |

### Path aliases

`@/*` resolves to `src/*` (configured in both `tsconfig.app.json` and `vite.config.ts`).

## Storybook

[Storybook](https://storybook.js.org) is configured with `@storybook/react-vite` and the a11y addon. Stories live next to their components and share the app's Tailwind v4 tokens and global styles via `.storybook/preview.ts`.

```bash
pnpm storybook          # dev server → http://localhost:6006
pnpm build-storybook    # static build → storybook-static/
```

| Story file                                        | Stories                                                                 |
| ------------------------------------------------- | ----------------------------------------------------------------------- |
| `src/components/showcase/GenderIcon.stories.tsx`  | Male, Female, Both, None                                                |
| `src/components/showcase/WheelPicker.stories.tsx` | Empty, FewNames, ManyNames, ChevronsLeft, ChevronsRight, MiddleSelected |

## Architecture

### High-level overview

```
┌──────────────┐  fetch  ┌────────────────┐  set state   ┌─────────────────┐
│ public/data/ │ ──────► │ petService     │ ───────────► │ Zustand store   │
│  *.json      │         │ (api.ts wrap)  │              │ (petStore.ts)   │
└──────────────┘         └────────────────┘              └────────┬────────┘
                                                                  │ subscribe
                                                                  ▼
                                          ┌──────────────────────────────────┐
                                          │ Selectors (useFilteredPets, …)   │
                                          └──────────────────┬───────────────┘
                                                             │
                                ┌────────────────────────────┼────────────────────────────┐
                                ▼                            ▼                            ▼
                        ┌──────────────┐          ┌────────────────────┐         ┌─────────────────┐
                        │ Filters      │          │ Showcase           │         │ Common          │
                        │ (gender,     │          │ (WheelPicker,      │         │ (Loading,       │
                        │  category,   │          │  NameDetails,      │         │  Error,         │
                        │  letter)     │          │  Placeholder)      │         │  ErrorBoundary) │
                        └──────────────┘          └────────────────────┘         └─────────────────┘
```

The app is a static SPA — there is no backend. On mount, `App` triggers `loadAll()` which fetches three JSON files in parallel from `public/data/`, normalises them into the Zustand store, and flips status from `idle → loading → ready`. All filtering happens in-memory on the client.

### Data flow

1. **`App.tsx`** wraps the tree in an `ErrorBoundary` and routes between `LoadingScreen`, `ErrorScreen`, and `Home` based on `status`.
2. **`Home.tsx`** kicks off `loadAll()` once and composes the layout: `GenderToggle` + `CategoryFilters` + `LetterFilters` + `NamesShowcase`.
3. **`store/petStore.ts`** is a single Zustand store holding all server data (pets, categories, filterGroups, letters) plus all UI filter state (`genderFilter`, `selectedCategoryIds`, `selectedLetter`).
4. **`store/selectors.ts`** exposes `useFilteredPets()` and `useCategoryMap()` — `useMemo`-backed selectors that derive view-ready data without polluting the store.
5. **`NamesShowcase`** receives the filtered list. It uses a `key` derived from the list to force the inner `ShowcaseContent` to remount when filters change — this cleanly resets `activeIndex` and `detailsOpen` without an effect.

### State management

A **single Zustand store** holds both server cache and UI state. This is intentional: the dataset is small and read-mostly, so co-locating filter state with data avoids prop-drilling and keeps selectors trivial. There is no need for React Query / RTK because:

- Data is fetched once at startup and never invalidated.
- There are no mutations.

For larger features, derived state lives in `selectors.ts` rather than the store, so the store stays a flat, serialisable bag of values.

### Wheel picker

The wheel picker (`components/showcase/WheelPicker.tsx`) is a virtualised list driven by an `activeIndex`:

- **Geometry** is centralised in `constants/showcase.ts` (`ROW_HEIGHT`, `STRIDE`, `VISIBLE_COUNT`, `OVERSCAN`, distance-based typography). Changing one constant rescales the whole component.
- **Scroll input** is captured by the `useWheelScroll` hook — a `passive: false` wheel listener that is throttled (~120 ms) to keep movement legible.
- **Keyboard input** (↑ ↓, Home, End, Enter) is wired directly into the picker for accessibility.
- **Touch input** is handled by Motion's drag gestures.
- Items use ARIA `listbox`/`option` roles for screen readers.

### Filtering

`useFilteredPets()` applies three filters in series:

1. `gender` — `B` (both) bypasses the check; otherwise `Pet.gender` must include `M` or `F`.
2. `categories` — OR-match: a pet is included if **any** of its category IDs are selected.
3. `letter` — first letter of `Pet.title` (uppercased) must equal the selected letter.

The result is memoised on `[pets, genderFilter, selectedCategoryIds, selectedLetter]`.

### Performance notes

- **React Compiler** is enabled via `babel-plugin-react-compiler` (see `vite.config.ts`). Most components do not need manual `memo` / `useMemo` / `useCallback`.
- **Images** are responsive WebP at two widths (420w, 840w) using `srcSet` + `sizes`, lazy-loaded.
- **JSON** is loaded once and cached in the store; filters operate on the in-memory array.
- **Wheel virtualisation** uses `OVERSCAN` to render only the visible window plus a small buffer.

### Project structure

```text
src/
├── components/
│   ├── common/        # LoadingScreen, ErrorScreen, ErrorBoundary
│   ├── filters/       # GenderToggle, CategoryFilters, LetterFilters
│   └── showcase/      # NamesShowcase, WheelPicker, NameDetails, Placeholder, GenderIcon
├── constants/         # Showcase geometry constants (ROW_HEIGHT, STRIDE, …)
├── hooks/             # useWheelScroll
├── pages/             # Home
├── services/          # fetchJSON (api.ts), petService
├── store/             # Zustand store (petStore.ts) + derived selectors
├── test/              # Vitest setup + helpers
├── types/             # TypeScript interfaces (Pet, Category, FilterGroup, …)
└── utils/             # cn() class-name helper
public/
├── data/              # Static JSON: names.json, categories.json, letters.json
└── images/            # Optimised WebP dog images (420w + 840w)
```

## Data contract

All three files under `public/data/` use a generic `{ data: T, … }` envelope (see `src/types/pet.ts`):

```ts
interface Pet {
  id: string;
  title: string;
  definition: string; // HTML string (may contain <p> tags, etc.)
  gender: ("M" | "F")[]; // a name can apply to one or both
  categories: string[]; // Category.id references
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}
interface FilterGroup {
  id: string;
  label: string;
  categoryIds: string[];
}
```

`categories.json` additionally returns a `filterGroups` array used to organise the category UI into themed dropdowns (e.g. "By origin", "By size").

## Assumptions

These are the explicit assumptions baked into the design — call them out if requirements change.

- **No backend.** All data lives in `public/data/*.json` and is fetched at startup. There is no auth, no API keys, no pagination, no CORS configuration.
- **Small, read-only dataset.** ~hundreds of names totalling <500 KB JSON. Loading the full set into memory and filtering client-side is acceptable; no virtualisation of the underlying data is needed (only the rendered rows).
- **Gender is `M`, `F`, or both.** A pet's `gender` array contains one or both values. The UI's "Both" filter (`B`) means _show every pet regardless of gender_, not "show only pets tagged with both genders".
- **Category filtering is OR, not AND.** Selecting multiple categories widens the result set. This matches the most common "show me anything in these themes" mental model.
