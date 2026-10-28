# Exercise 4 â€” Demo Answers

## Demo 1 â€” JSX, function components, typed props, composition & children

### Question 1: JSX expressions embedding JavaScript values

**Show one JSX expression in your code that embeds a JavaScript value or expression. What can and can't go inside `{...}` in JSX?**

In `PersonCard.tsx`, the person's name and role are JavaScript expressions embedded in JSX:

```tsx
<h3>{person.name}</h3>
<div className="person-role">{person.role}</div>
```

In `PeoplePage.tsx`, the people array is mapped to components, and each component receives its person as a prop:

```tsx
{data.people.map((person) => (
  <PersonCard key={person.id} person={person} />
))}
```

Inside a JSX expression container, `{...}`, you can use JavaScript **expressions** that produce a value: variables, property access, function calls, arithmetic, ternaries, logical expressions, object literals, and expressions that return JSX. For example, an object literal can be passed as a prop with `style={{ color: "red" }}`: the outer braces enter JavaScript, and the inner braces create the object.

You cannot put JavaScript **statements** directly in the container, such as `if`, `for`, or `while`. Use an expression such as a ternary or `&&`, or calculate the value before the `return`. A plain object or a Promise is also not a valid rendered React child, even though object literals and Promise expressions are valid JavaScript expressions; pass an object as a prop or render a supported value instead. `null`, `undefined`, and booleans are allowed as children and render no visible content.

### Question 2: TypeScript type checking for props

**For one component's typed props: what would TypeScript catch if you passed the wrong shape of data to it? Demonstrate a real type error.**

`PersonCard.tsx` declares its props explicitly:

```tsx
interface PersonCardProps {
  person: Person;
  onEvidenceClick?: (personId: string) => void;
}
```

The required `person` prop must match the `Person` interface. To demonstrate a real error, temporarily change a call in `PeoplePage.tsx` to:

```tsx
<PersonCard person="nova-byte" />
```

The `person` prop expects a `Person` object, not a string, so the TypeScript check (`npm run typecheck`) reports an error equivalent to:

```text
Type 'string' is not assignable to type 'Person'.
```

Other mistakes TypeScript catches include omitting the required `person` prop or supplying an object without required `Person` fields. The optional callback, if supplied, must accept a string person ID. After demonstrating the error, restore the valid call, `<PersonCard person={person} />`; the intentionally invalid example should not remain in the application.

### Question 3: Named props vs. `children` composition

**What's the difference between passing data as a named prop versus passing it as `children`? Why did you choose `children` for the component you built with it?**

A named prop gives a component a specific input, such as `person` in `<PersonCard person={person} />`. The receiving component knows the prop's type and decides how to present that data.

`children` is the content nested between a component's opening and closing tags. In this implementation, `PersonCard` and `LocationCard` each supply their own markup to the shared `Card`:

```tsx
<Card className="person-card">
  <h3>{person.name}</h3>
  {/* Person-specific content */}
</Card>
```

`Card` accepts `children: ReactNode` and renders them inside its wrapper. This keeps the wrapper independent of whether its content represents a person or a location. The data stays with the specialized card; the shared component provides only the common container (and optional title/class name). That makes it possible to reuse the wrapper with different content without teaching `Card` about each data type.

### Question 4: Why DOM manipulation conflicts with React's model

**Why does direct DOM manipulation conflict with React? What assumption does React make about who "owns" the DOM that direct manipulation breaks?**

React assumes it is responsible for updating the DOM subtree produced by its components. It calculates updates from the current props and state, then reconciles those updates with the DOM. If code also changes those same DOM nodes directlyâ€”for example, by assigning `innerHTML` or changing classes with `classList`â€”the DOM can stop matching what React rendered. A later React update may overwrite the external change, or the two sets of changes may conflict.

The important qualification is that React does not own every DOM node on the page: the conflict concerns the part of the DOM React renders and manages. Direct DOM access can be appropriate for specific integrations or through refs, but ordinary UI updates should be expressed through JSX, props, and state. For example, the active tab's class in `PeoplePage.tsx` is derived from `activeTab` rather than changed with `classList`.

The vanilla app's `innerHTML` rendering and manual class changes update the DOM imperatively. In React, the component describes what should appear, and React applies the corresponding DOM updates.

## Demo 2 â€” Conditional rendering

### Question 1: `&&` conditional rendering and the number-zero pitfall

**Show one place where you used `condition && <Component />` instead of a ternary. What would go wrong if `condition` were a number like `0` instead of a boolean and does that risk apply to your actual code?**

In `PeoplePage.tsx`, the People panel is rendered only when its tab is active:

```tsx
{activeTab === "people" && (
  data.people.length > 0 ? (
    <div id="peoplePanel" className="people-grid">
      {/* People cards */}
    </div>
  ) : (
    <p id="peoplePanel">No people available.</p>
  )
)}
```

The expression `activeTab === "people"` is a boolean. If the left side of `&&` were the number `0`, JavaScript would return `0` rather than the right-hand JSX expression; React renders that numeric zero as visible text. For example, `{items.length && <List />}` would display `0` when the list is empty. That risk does not apply here because `activeTab === "people"` (and the corresponding locations check) always evaluates to `true` or `false`. The list-length checks use ternaries, so they explicitly render either the list or an empty-state message.

The active tab button's `className` also uses a ternary to apply `"active"` only to the selected tab. These are meaningful conditional-rendering cases: the selected panel, the active-tab style, and the empty state when a collection has no entries. `&&` is suitable when content should appear only when a condition is true; the ternary is suitable when one of two alternatives must be rendered.

### Question 2: Returning `null` versus an empty `<div>`

**Why might returning `null` from a component be preferable to returning an empty `<div>` in some cases? Did you use either, and why?**

Returning `null` means a component renders nothing and adds no DOM node. That is preferable to an empty `<div>` when the component should be absent, because an unnecessary wrapper can affect layout, styling, or the DOM structure.

I did not use a component that returns `null` or an empty `<div>` for this demo. `PeoplePage` always renders its page structure; for an empty people or locations collection, it renders a useful message instead of an empty grid. For the selected tab, the `&&` expression omits the inactive panel entirely.

## Demo 3 â€” Rendering collections

### Question: What does React use `key` for internally?

React uses each key to identify an item among its siblings in a rendered collection. When a list changes, keys let React recognize that an item is still the same item even if its position changes. For example, if `[A, B, C]` becomes `[B, C]`, stable keys tell React that `B` and `C` are the existing items that shifted up, and that `A` was removed. Without stable keys, React may match items by their positions instead; if a component has local state, that state can then appear to belong to a different item after a reorder or removal. Keys should be unique among siblings and stable for the same item. In this app, the people, locations, and timeline event lists use their data IDs: `person.id`, `location.id`, and `event.id`.

## Demo 4 â€” Stable keys and list identity

### Runnable demo

Open `http://localhost:5173/keys-demo.html` with `npm run dev`. The page is separate from the real app ([KeysDemo.tsx](js/react/demos/KeysDemo.tsx)). Change the constant `USE_INDEX_KEY` at the top of that file:

- `true`: `key={index}`. Type a different note into each row, then click **Reverse order** or **Remove first**. The names move, but the typed notes stay at their positions, so a note now sits next to the wrong person.
- `false`: `key={row.id}`. The notes follow their people correctly.

### Question 1: What goes wrong with missing, duplicated, or index-based keys?

- **Missing keys:** React warns and falls back to matching items by position, which behaves like index keys.
- **Duplicated keys:** React cannot tell the items apart. It warns, and updates, removals or reorders may apply to the wrong item or leave stale items on screen.
- **Index keys:** the key describes the position, not the item. When the list is reordered or filtered, the item at a position changes but its key does not, so React reuses the old component instance (and its state, such as typed input text, focus, or open/closed state) for a different item. Items without local state may look fine, but extra work is done because every shifted item is updated.

### Question 2: Would `key={index}` in the old bug have caused a user-visible symptom?

Yes, it can be visible, not just a console warning. React raises no warning for index keys, because they are unique and valid. The problem is silent: after a list is filtered, reordered, or an item is removed, any state held by the row components (typed text, checkboxes, focus, expanded state) stays with the position instead of the item. In the demo, notes visibly jump to the wrong person. Similarly, an index used as an *identifier* (for example, to look up or delete an item) points to a different item once the list changes. I could not locate the original bug in the current code, so this answer is general rather than tied to that feature.

### Question 3: Is there ever a legitimate reason for `key={index}`?

Yes, when the list is static: it never reorders, filters, or has items inserted or removed in the middle (or is only appended to), the items have no local state, and there is no stable id available. An example would be a fixed list of strings generated once. It is not appropriate for this app's real data, which already has stable ids.

## Demo 5 â€” Presentational vs. feature components and component boundaries

### Task 1: Classification

**Presentational** (props in, markup out; no state, no data loading, no reading of the URL, `localStorage` or global state):

| Component | Why |
|---|---|
| `Card` | Generic shell, renders `children`. |
| `PersonCard`, `LocationCard` | Render one `Person` / `Location` given as props. |
| `TimelineEventCard` | Renders one event; resolves location names from the `locations` prop. |
| `Header` | Static markup. |
| `Nav` | Renders links from `currentView`; reports clicks through `onNavigate`. |
| `IntroCard`, `CaseSummaryCard`, `StatCard`, `ReviewProgress`, `RecentEvidence`, `RecentTimeline` | Only show the values they receive as props. |

**Feature / container** (owns state, reads outside sources, or decides what data goes where):

| Component | Why |
|---|---|
| `App` | Uses `useCurrentView` (hash routing) and `useCaseData` (fetching), and chooses the page. |
| `DashboardPage` | Derives review stats and reads the bookmark count from `localStorage`, then passes values to presentational children. |
| `PeoplePage` | Owns the active-tab state, reads `?tab=` from the URL, listens for `popstate`, and computes evidence counts. |
| `TimelinePage` | Receives the loaded timeline data and decides what to render for it. |

`EvidencePage` and `WorkspacePage` are still stubs and are not part of this exercise.

### Task 2: The split

`PersonCard` was doing two jobs: it looked up how many evidence items mention the person (`countEvidenceForPerson`, which reads global state) and it rendered the card. I split it:

- **`PersonCard` (presentational):** takes `person`, `evidenceCount` and an optional `onEvidenceClick`, and only renders them.
- **`PeoplePage` (feature):** computes `evidenceCount` from the loaded `data.evidence` using `evidenceMentionsPerson` and passes it down.

This also fixed a real bug. `countEvidenceForPerson` reads the vanilla app's global `state.allEvidence`, which the React page never fills, so the count was always 0.

### Question 1: Responsibility of each half, and independence

- `PersonCard` is responsible for how one person looks. `PeoplePage` is responsible for which data goes into it (including how evidence is matched to a person).
- A change inside one half does not affect the other as long as the props contract (`person`, `evidenceCount`, `onEvidenceClick`) stays the same. If the matching rule changes (for example, matching by name as well as id), only `PeoplePage`/`lookup` changes. If the card layout changes, only `PersonCard` changes. This also makes `PersonCard` easy to show with any number, without any app state.

### Question 2: Rule used

A component is presentational if its output depends only on its props: it does not hold state, fetch data, read the URL, `localStorage` or global state, and it reports events upward through callback props. As soon as a component needs to read from one of those sources or decide which data to show, it is a feature component, and the presentational components below it receive the results as props.
