# Dog Name Generator

A fast, beautiful pet-name browsing tool built with React 19, Vite, Tailwind CSS v4, Zustand, and Motion.

Users can scroll through hundreds of dog names using a satisfying wheel-picker interface, filter by gender, category, and starting letter, and view the meaning of each name.

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

| Layer | Library |
|---|---|
| UI framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| State management | Zustand 5 |
| Animations | Motion (Framer Motion) |
| Icons | Lucide React |

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Type-check and build for production |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | ESLint |
| `pnpm format` | Prettier |

## Project Structure

```text
src/
├── components/
│   ├── common/        # LoadingScreen, ErrorScreen, ErrorBoundary
│   ├── filters/       # GenderToggle, CategoryFilters, LetterFilters
│   └── showcase/      # NamesShowcase, WheelPicker, NameDetails, Placeholder, GenderIcon
├── constants/         # Showcase geometry constants (ROW_HEIGHT, STRIDE, etc.)
├── hooks/             # useWheelScroll
├── pages/             # Home
├── services/          # fetchJSON, petService (data fetching)
├── store/             # Zustand store + selectors
├── types/             # TypeScript interfaces (Pet, Category, etc.)
└── utils/             # cn() class-name helper
public/
├── data/              # Static JSON data files (names, categories, letters)
└── images/            # Optimised WebP dog images (420w + 840w)
```

## Data

All pet names are stored as static JSON files under `public/data/`. No backend is required — the app fetches these files at startup.

## Images

Dog images are served as responsive WebP from `/public/images/`, with `srcset` providing 420 w and 840 w variants. Original PNGs (~14–19 MB each) are kept under `src/assets/dogs/` and are **not** imported into the bundle.
