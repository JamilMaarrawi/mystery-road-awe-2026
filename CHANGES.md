# Changes

## Exercise 3, Demo 6: React + TypeScript entry point

### What was added

- Packages: `react`, `react-dom` (dependencies); `@types/react`, `@types/react-dom`, `@vitejs/plugin-react` (devDependencies).
- `vite.config.js`: React plugin, and both `index.html` and `react.html` as build inputs.
- `tsconfig.json`: `"jsx": "react-jsx"` so TypeScript understands `.tsx`.
- `eslint.config.js`: the TypeScript rules now also apply to `.tsx`.
- `react.html`, `js/react/main.tsx`, `js/react/App.tsx`: the React entry point.

### How the two versions coexist

The project now has **two separate pages** that share the same project, styles and data:

| Page | URL (dev server) | Entry script | Version |
|---|---|---|---|
| `index.html` | `http://localhost:5173/` | `js/main.ts` | Vanilla TypeScript (unchanged) |
| `react.html` | `http://localhost:5173/react.html` | `js/react/main.tsx` | React |

They do not interfere with each other. Each page loads only its own entry script, so the vanilla code never runs on the React page and the other way round.

**Switching:** just open the other URL (or use the link on the React page that leads back to the vanilla app). There is no toggle inside one page. Each switch is a normal page load, so in-memory state is not shared. `localStorage` is shared because both pages are on the same origin.

### Why this choice (and not a full swap-over)

- The vanilla app keeps working at all times, so it can be used to compare behavior while migrating.
- A broken React page cannot break the working app.
- Views can be moved to React one at a time (Exercises 3 to 5). Once the React version is complete, `index.html` can be replaced by it.
- A full swap-over would leave the app half-broken until every view is rewritten.

The downside: for a while there are two entry points, and some logic exists twice.

### How the React page gets onto the screen

1. The browser loads `react.html`, which contains an empty `<div id="root">` and a `<script type="module">`.
2. The script points at `js/react/main.tsx`. Vite compiles the TSX to plain JavaScript (JSX becomes function calls) in dev and when building.
3. `main.tsx` calls `createRoot(root).render(<App />)`, which puts the output of the `App` component into `#root` in the real DOM.

### What each new package does

- `react`: the component model (components, hooks, JSX runtime).
- `react-dom`: renders React components into the browser DOM.
- `@vitejs/plugin-react`: lets Vite compile JSX/TSX and adds Fast Refresh (HMR that keeps component state).
- `@types/react`, `@types/react-dom`: TypeScript types only.
