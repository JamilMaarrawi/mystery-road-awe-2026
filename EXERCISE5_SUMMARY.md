# Exercise 5: React State Management & Event Handling — COMPLETE ✓

## Overview
Exercise 5 builds on Exercise 4's component foundation by adding state management, event handling, and data flow patterns. All 10 demos are now functionally complete.

---

## Demo Completion Status

### Demo 1: Event Handling Migration ✓
**Status**: Complete  
**Components Modified**:
- `EvidencePage`: Search input with `onChange` + `onSubmit` handlers
- `HypothesisForm`: Form fields with controlled inputs (onChange, onSubmit)
- `EvidenceDetail`: Save note button with onClick handler
- `PersonDetailPage`: Derived data computations (no interactivity needed)

**Key Patterns**:
- React `onChange` replaces vanilla `addEventListener('input', ...)`
- React `onSubmit` replaces vanilla form submission listeners
- Controlled inputs: value + onChange handler for each field
- No vanilla `addEventListener` or manual DOM event setup

---

### Demo 2: useState for Controlled Forms ✓
**Status**: Complete  
**Location**: `js/react/features/evidence/components/EvidencePage.tsx`

**Implementation**:
```tsx
const [filters, dispatch] = useReducer(evidenceFiltersReducer, DEFAULT_FILTERS);
const [selectedId, setSelectedId] = useState<string | null>(() => searchParams.get("item"));
```

**Demonstrates**:
- Controlled input fields with `onChange` handlers
- State updates on every keystroke
- Form validation through derived state (filtered results)
- Multiple independent form fields (search, type, person, location, status, relevance, sort)

---

### Demo 3: Immutable State Updates ✓
**Status**: Complete  
**Key Example**: Bookmark toggle
```tsx
const updated = toggleBookmark(bookmarks, id);  // Creates new array
setBookmarks(updated);  // React detects new reference
```

**Immutable Patterns Used**:
- Spread operator for object updates: `{ ...notes, [id]: text }`
- Array copying: `toggleBookmark` returns new array, never mutates original
- Filter/map/sort: All evidence functions return new arrays
- Reducer pattern: Each action returns new state object

---

### Demo 4: Derived Values ✓
**Status**: Complete  
**Example**: Dashboard stats
```tsx
const { reviewedCount, progressPct } = computeReviewStats(data.evidence);
const bookmarkCount = bookmarks.length;
```

**Pattern**: 
- Computed on every render from props
- Cannot go stale (always reflects current props)
- No useState needed for derived data
- Used in Dashboard, WorkspacePage, EvidencePage (filtered results)

---

### Demo 5: State Lifting ✓
**Status**: Complete  
**Architecture**:
```
App.tsx (single source of truth)
├── bookmarks state + handleBookmarkClick callback
├── notes state + handleSaveNote callback
└── Routes to:
    ├── DashboardPage (reads: bookmarks)
    ├── EvidencePage (reads: bookmarks, notes; calls: onToggleBookmark, onSaveNote)
    ├── WorkspacePage (reads: bookmarks, notes)
    └── ...others
```

**Before**: Each view read bookmarks and notes separately with `useState(readBookmarks)`  
**After**: App owns state; views receive through props  
**Benefit**: Single source of truth; state changes instantly visible across all views

---

### Demo 6: Passing Callbacks Downward ✓
**Status**: Complete  
**Callbacks Implemented**:
1. `onToggleBookmark`: App → EvidencePage (saves bookmarks)
2. `onSaveNote`: App → EvidencePage (saves notes to localStorage)

**Pattern**:
```tsx
// In App.tsx
function handleBookmarkClick(id: string) { ... }

// Props to EvidencePage
<EvidencePage
  onToggleBookmark={handleBookmarkClick}
  onSaveNote={handleSaveNote}
/>

// EvidencePage calls callback on user action
<button onClick={() => onToggleBookmark(item.id)}>Bookmark</button>
```

**Flow**: User action → Callback invoked → App state updates → All views re-render

---

### Demo 7: useReducer for Complex State ✓
**Status**: Complete  
**File**: `js/react/features/evidence/filters.ts`

**Before**: 7 separate useState calls in EvidencePage
```tsx
const [search, setSearch] = useState("");
const [type, setType] = useState("");
const [personId, setPersonId] = useState("");
// ... 4 more ...
```

**After**: Single useReducer
```tsx
export type EvidenceFilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_TYPE"; payload: string }
  | { type: "SET_PERSON"; payload: string }
  // ... 4 more ...
  | { type: "CLEAR_FILTERS" };

export function evidenceFiltersReducer(
  state: EvidenceFilters,
  action: EvidenceFilterAction
): EvidenceFilters { ... }

// In component
const [filters, dispatch] = useReducer(evidenceFiltersReducer, DEFAULT_FILTERS);
dispatch({ type: "SET_SEARCH", payload: "murder" });
```

**Benefits**:
- Typed actions (TypeScript catches mistakes)
- Batch-related state changes
- Clear intent: "CLEAR_FILTERS" vs 7 setters
- Testable reducer function (pure)

---

### Demo 8: Context API Evaluation ✓
**Status**: Complete (decision made)

**Decision**: Context is NOT needed here.

**Reasoning**:
- Current prop-drilling depth: **1 level only** (App → 3 direct consumers)
  - `bookmarks` → DashboardPage, EvidencePage, WorkspacePage
  - `notes` → EvidencePage, WorkspacePage
- At 1-2 levels, prop drilling is explicit and easy to trace
- Context adds complexity: setup, provider wrapper, useContext hooks, potential render thrashing
- Rule of thumb: Context makes sense at 4+ nesting levels or with 10+ consumers
- Shallow prop drilling is **preferable**

**Trade-off**:
- Pro: Explicit data flow, easier to debug, clear dependencies
- Con: Add props to intermediate components if nesting increases in future
- Decision: Keep props; refactor to Context only if nesting reaches 4+ levels

---

### Demo 9: Diagnose and Fix State Problems ✓
**Status**: Complete

**Problem Found & Fixed**: Stale state in notes

**Issue**:
```tsx
// EvidencePage
const [notes, setNotes] = useState(readNotes);
function saveNote(id: string, text: string) {
  setNotes({ ...notes, [id]: text });
}

// WorkspacePage
const [notes] = useState(readNotes);  // Separate read, never updated!
const notedItems = data.evidence.filter(item => notes[item.id]);  // Stale!
```

**Scenario**: User saves note in EvidencePage → WorkspacePage still shows old data

**Solution**: Lift notes to App.tsx
```tsx
// App.tsx
const [notes, setNotes] = useState(readNotes);
function handleSaveNote(id: string, text: string) { ... }

// Both views receive same notes through props
<EvidencePage notes={notes} onSaveNote={handleSaveNote} />
<WorkspacePage notes={notes} />
```

**Result**: Note saved in EvidencePage → App state updates → WorkspacePage instantly sees new notes

**Other State Patterns Verified**:
- ✓ No mutated state (immutable updates throughout)
- ✓ No duplicated state (single source for each data type)
- ✓ No excessive prop drilling (max 1 level)
- ✓ All derived values properly computed (never stored)

---

### Demo 10: Remove DOM Manipulation ✓
**Status**: Complete

**Audit Results**:
- ✓ No `querySelector`
- ✓ No `getElementById` (except React bootstrap in main.tsx — correct)
- ✓ No `innerHTML`
- ✓ No `classList` manipulation
- ✓ No `appendChild` / `removeChild`
- ✓ No manual `setAttribute`

**DOM Updates All Go Through React**:
- Conditional rendering: `{data.loading && <Spinner/>}`
- List rendering: `results.map(item => <Card key={item.id} />)`
- Event handlers: `onClick={handleClick}`
- Controlled inputs: `value={search} onChange={setSearch}`

**Bootstrap Code Only**:
```tsx
// main.tsx - Only acceptable DOM access
const rootElement = document.getElementById("root");
createRoot(rootElement).render(<App />);
```

---

## Architecture Summary

### State Hierarchy
```
App.tsx (root)
├── bookmarks (Array<string>) — lifted from Evidence
├── notes (Record<string, string>) — lifted from Evidence + Workspace
├── data (CaseDataState) — from useCaseData hook
└── routing state — via React Router (URL params, query params)
```

### Patterns Used
1. **Lifted State**: Bookmarks, notes at App level
2. **Callbacks Down, State Up**: User actions call callbacks → App updates → props re-render
3. **Immutable Updates**: Spread operator, array methods (never mutate)
4. **Derived State**: Filtered results, computed stats (never stored)
5. **Reducers**: Complex filter state managed via typed actions
6. **React Router**: Structural navigation + URL-based filtering

### Data Flow Example
```
User clicks "Bookmark" in EvidenceCard
    ↓
EvidenceCard.onBookmark() called
    ↓
EvidencePage passes to App via onToggleBookmark()
    ↓
App.handleBookmarkClick() updates state
    ↓
writeBookmarks() persists to localStorage
    ↓
setBookmarks() updates React state
    ↓
All views (Dashboard, EvidencePage, WorkspacePage) re-render with new props
```

---

## File Changes Summary

### Modified Files
- **App.tsx**: Added notes state and handleSaveNote callback; updated route props
- **EvidencePage.tsx**: Switched to useReducer; receive notes and callbacks from App
- **WorkspacePage.tsx**: Receive notes from App (removed useState)
- **filters.ts**: Added evidenceFiltersReducer and typed actions

### Total Impact
- ✓ 4 files modified
- ✓ ~100 lines of improvements
- ✓ Zero breaking changes
- ✓ Backward compatible with Exercise 4

---

## Testing & Verification

All demos verified with:
```bash
npm run typecheck  # ✓ No type errors
npm run lint       # ✓ No linting issues
npm run build      # ✓ Builds successfully
```

---

## Next Steps: Exercise 6

Exercise 5 is feature-complete. Ready to proceed to Exercise 6, which will build on:
- Component architecture ✓
- State management patterns ✓
- Event handling ✓
- Data flow ✓
