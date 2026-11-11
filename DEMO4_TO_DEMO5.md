# Demo 4 → Demo 5: What You Need to Know

## What Demo 4 Gives You

**Demo 4 is now complete.** The backend is running and ready to be consumed by the frontend.

### Available Endpoints

Your frontend (Demo 5) will call these 5 endpoints via `fetch()`:

```
GET http://localhost:3001/api/case
GET http://localhost:3001/api/evidence
GET http://localhost:3001/api/people
GET http://localhost:3001/api/locations
GET http://localhost:3001/api/timeline
```

Each endpoint:
- Returns JSON in the same shape as the current `data/*.json` files
- Responds instantly (like the files do)
- Optionally accepts `?delay=<ms>` and `?error=true` query parameters (for later testing)

### Example Response

```bash
curl http://localhost:3001/api/case
```

Returns:
```json
{
  "caseId": "REMOTION-2026-10",
  "title": "Project ReMotion ??? Investigation Portal",
  "subtitle": "Investigate the failure of an AI-assisted rehabilitation robot.",
  "status": "open",
  ...
}
```

---

## What Demo 5 Will Do

Demo 5 replaces your current static imports/fetches with real backend calls inside `useEffect`.

### Before (Current — Static Files)

In `js/react/features/dashboard/useCaseData.ts`:
```typescript
const caseData = await fetchJson<CaseData>("data/case.json");
const people = await fetchJson<Person[]>("data/people.json");
const evidence = await fetchJson<Evidence[]>("data/evidence.json");
// etc. — fetches local files, always instant or 404
```

### After (Demo 5 — Backend)

Will become:
```typescript
useEffect(() => {
  const controller = new AbortController();
  
  async function fetchData() {
    try {
      const caseData = await fetch("http://localhost:3001/api/case")
        .then(r => r.json());
      const people = await fetch("http://localhost:3001/api/people")
        .then(r => r.json());
      // etc.
      setCaseData(caseData);
      setPeople(people);
      // ...
    } catch (err) {
      setError(err.message);
    }
  }
  
  fetchData();
  return () => controller.abort(); // cleanup
}, []);
```

---

## Key Points for Demo 5

### 1. The Backend Must Be Running
**Make sure the backend is running before you test Demo 5:**

```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend
npm run dev:backend
```

Both must be running. The frontend (port 5173) will fetch from the backend (port 3001).

### 2. URL Changes
Replace all references to `data/*.json` with `http://localhost:3001/api/*`:

| Old (Demo 5 starts from) | New (Demo 5 target) |
|---|---|
| `data/case.json` | `http://localhost:3001/api/case` |
| `data/evidence.json` | `http://localhost:3001/api/evidence` |
| `data/people.json` | `http://localhost:3001/api/people` |
| `data/locations.json` | `http://localhost:3001/api/locations` |
| `data/timeline.json` | `http://localhost:3001/api/timeline` |

### 3. Response Shape Is Identical
The backend returns exactly the same JSON shape as the files. No type changes needed.

### 4. Testing Controls (For Later Demos)
Demo 5 won't use these, but they're available for Demos 7-10:

```bash
# Artificial delay (2 seconds)
curl "http://localhost:3001/api/evidence?delay=2000"

# Error injection
curl "http://localhost:3001/api/people?error=true"

# Combined (delay then error)
curl "http://localhost:3001/api/case?delay=1000&error=true"
```

You'll use these in Demo 7 to test cancellation and request races.

---

## Architecture Diagram

```
Your React App (port 5173)
        ↓
   (Demo 5 change here)
        ↓
fetch("http://localhost:3001/api/case")
        ↓
Express Backend (port 3001)
        ↓
reads public/data/case.json
        ↓
returns JSON
```

---

## What Stays the Same

- Component structure (no changes needed)
- Data types (`Person`, `Evidence`, etc.)
- The types of state you already track
- Bookmarks, notes, hypothesis draft (still in `localStorage`)

---

## What's New (That Demo 5 Will Add)

- `useEffect` hook (to run fetch on mount)
- Fetch logic (replace imports with `fetch()` calls)
- Loading/error states (initial state before data arrives)
- Async-await handling inside the effect

---

## Ready for Demo 5?

✅ Backend is running on `http://localhost:3001`  
✅ All 5 endpoints return correct data  
✅ Testing controls (?delay, ?error) are working  
✅ CORS enabled for cross-port frontend requests

**Next step: Modify the frontend to call these endpoints inside `useEffect`** (Demo 5)

You'll:
1. Move `fetchJson` calls from synchronous imports to async `useEffect`
2. Add state for loading/error/data
3. Wire up the fetch to run on component mount
4. Render conditionally based on loading/error/ready states

That's Demo 5! But first, do Demos 1–3 if you want deep understanding of `useEffect` and cleanup (highly recommended but not strictly required).
