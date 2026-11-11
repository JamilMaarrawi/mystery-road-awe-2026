# Exercise 6 Demo 5: Consume the Backend from React ✅ COMPLETE

## What Changed

Demo 5 replaces static file imports with real backend calls inside `useEffect`.

### File Modified
- `js/react/features/dashboard/useCaseData.ts`

### The Change

**Demo 4 (Static Files) — Now Commented Out:**
```typescript
// Demo 4 comparison (static files approach — now replaced):
// const caseData = await fetchJson<CaseData>("data/case.json");
// const people = await fetchJson<Person[]>("data/people.json");
// const locations = await fetchJson<Location[]>("data/locations.json");
```

**Demo 5 (Backend) — Now Active:**
```typescript
// Demo 5: Fetch from backend instead of static files
const caseData = await fetchJson<CaseData>(`${API_BASE}/case`);
const people = await fetchJson<Person[]>(`${API_BASE}/people`);
const locations = await fetchJson<Location[]>(`${API_BASE}/locations`);
```

### Backend Endpoints Mapped

| Old URL | New URL |
|---------|---------|
| `data/case.json` | `http://localhost:3001/api/case` |
| `data/people.json` | `http://localhost:3001/api/people` |
| `data/locations.json` | `http://localhost:3001/api/locations` |
| `data/evidence.json` | `http://localhost:3001/api/evidence` |
| `data/timeline.json` | `http://localhost:3001/api/timeline` |

---

## Key Observations (What Stays the Same)

### ✅ useEffect Structure Unchanged
- Still runs on mount (empty dependency array `[]`)
- Still sets up cancellation flag
- Still returns cleanup function that sets `cancelled = true`

```typescript
useEffect(() => {
  let cancelled = false;
  
  async function loadCore() { ... }
  async function loadEvidence() { ... }
  async function loadTimeline() { ... }
  
  void loadCore();
  void loadEvidence();
  void loadTimeline();
  
  return () => { cancelled = true; };
}, []);
```

### ✅ Error Handling Unchanged
- Same try/catch blocks
- Same error message construction
- Same state updates on error

### ✅ State Management Unchanged
- Same `LoadStatus` type: `"loading" | "ready" | "error"`
- Same `CaseDataState` interface
- Same initial state structure
- Same state mutations (`setData((prev) => ({ ...prev, ... }))`)

### ✅ Loading Behavior Unchanged
- All three data groups still load independently
- Still show `loading` state until each completes
- Still handle errors per-group (one group failing doesn't block others)

---

## What Changed (In useEffect)

### Fetch URLs
```typescript
// Now: Backend URLs
const API_BASE = "http://localhost:3001/api";
await fetchJson<CaseData>(`${API_BASE}/case`);

// Was: Local files
// await fetchJson<CaseData>("data/case.json");
```

### No Other Changes
- Cancellation logic: same ✓
- Error handling: same ✓
- State updates: same ✓
- Loading sequence: same ✓

---

## Demo 5 Questions Answered

### "Walk through exactly what happens, in order, from the component mounting to the data actually being available to render"

1. Component mounts → `useCaseData` hook runs
2. `useState` initializes `data` to `INITIAL_STATE` (all loading, all empty arrays)
3. Component renders with loading state
4. `useEffect` runs (dependency array is empty, so runs once on mount)
5. Three async functions (`loadCore`, `loadEvidence`, `loadTimeline`) are invoked
6. Each calls `fetchJson()` which does `fetch()` to backend
7. Browser sends HTTP request to `http://localhost:3001/api/case` (etc.)
8. Backend reads `public/data/case.json` and returns JSON
9. JSON arrives → `setData()` is called with new data
10. React re-renders with new state
11. Component now displays data instead of loading message

### "What's different about your component now compared to before?"

**Before (Demo 4 — Static Files):**
- Data was available immediately (fetch was instant)
- No real "loading" state visible in practice
- Files were bundled with app
- Network latency was 0ms

**After (Demo 5 — Backend):**
- Data arrives over HTTP (network latency visible)
- `loading` state now actually visible
- Backend can simulate delays with `?delay=` param
- Backend can return errors with `?error=true` param
- This teaches what **really** happens in production

**What's NOT different:**
- The React code structure
- How state is managed
- When effects run
- How errors are caught

---

## What State Variables Track?

Same as before:
```typescript
type LoadStatus = "loading" | "ready" | "error";

interface CaseDataState {
  caseData: CaseData | null;      // null while loading
  people: Person[];                 // [] while loading
  locations: Location[];            // [] while loading
  evidence: Evidence[];             // [] while loading
  timeline: TimelineEvent[];        // [] while loading
  
  coreStatus: LoadStatus;           // Tracks: case/people/locations
  evidenceStatus: LoadStatus;       // Tracks: evidence
  timelineStatus: LoadStatus;       // Tracks: timeline
  
  coreError: string | null;         // Error message if core fails
}
```

Components use these to decide what to render:
- `coreStatus === "loading"` → Show spinner
- `coreStatus === "error"` → Show error message
- `coreStatus === "ready"` → Show data

---

## Verification

✅ **Build**: No TypeScript errors, builds successfully  
✅ **Backend**: Running on `http://localhost:3001`  
✅ **Endpoints**: All 5 return correct data  
✅ **CORS**: Enabled for frontend (port 5173) to backend (port 3001)  
✅ **Fetch URLs**: Changed from `data/*.json` to `http://localhost:3001/api/*`  
✅ **useEffect**: Still runs on mount, still has cancellation  
✅ **Error Handling**: Unchanged  
✅ **Old Code**: Preserved in comments for comparison

---

## Running Demo 5

**Terminal 1 — Frontend:**
```bash
npm run dev
```
Runs on `http://localhost:5173`

**Terminal 2 — Backend:**
```bash
npm run dev:backend
```
Runs on `http://localhost:3001`

Both must be running for the frontend to successfully fetch data.

---

## Next Step: Demo 6

Demo 6 will add explicit loading/error/empty states that are now **visible** because:
1. Data arrives over network (not instant)
2. Backend can simulate delays (`?delay=`)
3. Backend can trigger errors (`?error=true`)

This makes it worth implementing proper UI states for all three conditions.

---

## Git Commit

```
312d520 Exercise 6 Demo 5: Consume backend from React
```

Changes:
- Modified `useCaseData.ts` to fetch from backend
- Kept old static code commented for comparison
- No breaking changes to component structure
- Ready for Demo 6
