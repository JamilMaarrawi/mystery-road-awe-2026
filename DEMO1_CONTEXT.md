# Demo 1 Context — Exercise 4

**Session Transfer: All conversation from 2026-10-26 after 15:00**

## Project Status

- **Environment:** Node 24.22.1 LTS, Vite 8, TypeScript 6, ESLint 10, Prettier 3
- **Project:** Project ReMotion Investigation Portal (React migration)
- **Exercise 3:** Complete ✓ (Dashboard fully in React with routing)
- **Current Task:** Exercise 4 Demo 1 — JSX, function components, typed props, composition with children

## Folder Structure (Just Reorganized)

```
js/react/
├── shared/
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Nav.tsx
│   └── useCurrentView.ts
└── features/
    ├── dashboard/
    │   ├── components/ (DashboardPage + 7 sub-components)
    │   ├── useCaseData.ts
    │   ├── dashboardStats.ts
    │   └── bookmarks.ts
    ├── people-locations/
    │   └── components/ (PeoplePage stub)
    ├── timeline/
    │   └── components/ (TimelinePage stub)
    ├── evidence/
    │   └── components/ (EvidencePage stub)
    └── workspace/
        └── components/ (WorkspacePage stub)

App.tsx
main.tsx
```

**Build Status:** typecheck ✓, lint ✓, build ✓

## Demo 1 Task

### Requirement
- Build at least 3 small components with **explicitly typed props** (no untyped or `any`)
- Build at least 1 component that takes `children` and use it in a real place
- Answer questions about JSX, type safety, and composition

### The Plan

Build for **People & Locations** and **Timeline** views:

1. **`Card.tsx`** (shared wrapper with `children`)
   - Location: `js/react/shared/components/Card.tsx`
   - Props: `{ children: ReactNode; title?: string; className?: string }`
   - Purpose: Generic reusable card shell
   - Why children? PersonCard and LocationCard both need consistent layout; `children` makes it reusable without duplicating markup

2. **`PersonCard.tsx`**
   - Location: `js/react/features/people-locations/components/PersonCard.tsx`
   - Props: `{ person: Person; onEvidenceClick?: (personId: string) => void }`
   - Composes `Card` by rendering person content inside it

3. **`LocationCard.tsx`**
   - Location: `js/react/features/people-locations/components/LocationCard.tsx`
   - Props: `{ location: Location }`
   - Composes `Card` by rendering location content inside it

## Data Types

From `js/core/types.ts`:

```typescript
interface Person {
  id: string;
  name: string;
  role: string;
  avatar: string;
  speciality: string;
  responsibilities: string[];
  statement: string;
}

interface Location {
  id: string;
  name: string;
  description: string;
  contains: string[];
}

interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  certainty: 'low' | 'medium' | 'high';
  type: string;
  personIds: string[];
  locationIds: string[];
  evidenceIds: string[];
}
```

## Vanilla Reference

**People & Locations** (`js/views/people.ts`):
- Two tabs: "people" and "locations" (switched by `switchPeopleTab()`)
- `renderPeople()`: builds HTML for `.person-card` divs
  - Avatar image
  - Name & role in header
  - Speciality text
  - Responsibilities list (`<ul>`)
  - Statement in quote box
  - Evidence count link
- `renderLocations()`: builds HTML for `.location-card` divs
  - ID + name heading
  - Description
  - "Contains" list (`<ul>`)

**Timeline** (`js/views/timeline.ts`):
- Filter dropdowns (order, person filter, location filter, type filter)
- `renderTimeline()`: builds HTML for `.timeline-event` divs
  - Timestamp + certainty badge
  - Title
  - Description
  - Location names (meta)
  - Evidence link buttons

## Utilities Available

- `js/utils/format.ts` has `formatDate()`, `getStatusBadgeClass()`, `certaintyBadgeClass()`
- `js/core/lookup.ts` has `countEvidenceForPerson()`, `locationLabel()`

## Key Principles for This Exercise

- **No `innerHTML`, no manual DOM creation** — React manages the DOM
- **All props explicitly typed** — TypeScript catches wrong shapes
- **Children composition** — Pass content as children instead of props when the component is a container
- **No `useState` or interactivity** — Just render the initial view with data passed in

## Next Steps

1. Build `Card.tsx` with children
2. Build `PersonCard.tsx` using Card
3. Build `LocationCard.tsx` using Card
4. Update `PeoplePage.tsx` to use them
5. Answer Demo 1 questions
6. Verify build passes

---

**All conversation from 2026-10-26 15:00+ summarized above.**
