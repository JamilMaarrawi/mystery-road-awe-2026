# Exercise 4 — Demo Answers

## Demo 1 — JSX, function components, typed props, composition & children

### Question 1: JSX expressions embedding JavaScript values

**Show one JSX expression that embeds a JavaScript value or expression. What can and can't go inside `{...}` in JSX?**

**Example from PersonCard.tsx:**
```jsx
<h3>{person.name}</h3>
<div className="person-role">{person.role}</div>
<p>
  {evidenceCount} related evidence item{evidenceCount === 1 ? "" : "s"} &mdash;
</p>
```

**What CAN go inside `{...}`:**
- Variable references: `{person.name}`
- Computed values/expressions: `{evidenceCount === 1 ? "" : "s"}`
- Function calls: `{countEvidenceForPerson(person)}`
- Ternary operators: `{condition ? <A /> : <B />}`
- Logical operations: `{activeTab === "people" && <div>...</div>}`
- JSX elements: `{data.people.map(p => <PersonCard key={p.id} person={p} />)}`

**What CANNOT go inside `{...}`:**
- Statements (if/for/while): `{if (x) { ... }}` ❌
- Object literals (unless destructured/returned): `{{ key: value }}` ❌ (interpreted as code block, not object)
- Undefined/null rendered as empty: `{undefined}` renders nothing
- Promises/async functions (unless awaited properly): `{async () => {...}}` ❌

---

### Question 2: TypeScript type checking for props

**For one component's typed props: what would TypeScript catch if you passed the wrong shape? Demonstrate a real type error.**

**Component:** `PersonCard.tsx` with props interface:
```typescript
interface PersonCardProps {
  person: Person;
  onEvidenceClick?: (personId: string) => void;
}
```

**Real Type Errors TypeScript Would Catch:**

If you tried to pass:
```jsx
// ❌ WRONG: Missing required 'person' prop
<PersonCard />

// ❌ WRONG: Wrong type for person (should be Person object)
<PersonCard person="nova-byte" />

// ❌ WRONG: Wrong shape for person (missing required fields like 'id', 'name', 'role')
<PersonCard person={{ name: "Nova" }} />

// ❌ WRONG: Wrong callback signature (expects string, got number)
<PersonCard person={person} onEvidenceClick={(id: number) => console.log(id)} />

// ✅ CORRECT: All props match the interface
<PersonCard person={person} onEvidenceClick={(personId: string) => navigate(personId)} />
```

TypeScript would display errors like:
```
Property 'name' is missing in type '{ }' but required in type 'Person'
Type 'string' is not assignable to type 'Person'
```

This prevents bugs at compile time, not runtime.

---

### Question 3: Named props vs. `children` composition

**What's the difference between passing data as a named prop versus passing it as `children`? Why did you choose `children` for Card?**

**Named Props (data prop):**
```jsx
// Data is passed AS a prop
<PersonCard person={person} />
// Component receives and renders the person object
```
- Used when passing **data** to a component
- The component is tightly coupled to that specific data shape
- Good for: PersonCard, LocationCard — they each know what shape they expect

**Children Composition:**
```jsx
// Content is passed AS children (component markup)
<Card className="person-card">
  <div className="person-card-header">
    <img src={person.avatar} alt={...} />
    <h3>{person.name}</h3>
  </div>
  {/* More content */}
</Card>
```
- Used when passing **layout/markup** to a container component
- The container is NOT tightly coupled to any specific data
- The parent decides what content goes inside
- Good for: Card, buttons, modals, wrappers — reusable shells

**Why we chose `children` for Card:**
- Card is a **generic container** with no opinion about its content
- PersonCard and LocationCard each format their own data and pass it as children
- If we added a third card type (e.g., EvidenceCard), it automatically works with Card without modification
- This follows the **"composition over inheritance"** pattern and makes Card truly reusable

**Comparison:**
```jsx
// ❌ BAD: Card tightly coupled to Person data
<Card person={person} className="person-card" />

// ✅ GOOD: Card is flexible, content comes from children
<Card className="person-card">
  {/* PersonCard or LocationCard decides the content */}
</Card>
```

---

### Question 4: Why DOM manipulation conflicts with React's model

**Why does direct DOM manipulation conflict with React? What assumption does React make about who "owns" the DOM?**

**React's Core Assumption:**
React assumes it has **exclusive ownership** of the DOM it renders. React is the single source of truth for what the DOM should look like.

**What the Vanilla App Did (Conflicts with React):**
```javascript
// From vanilla app - DIRECT DOM manipulation
html += '<div class="person-card">';
html += '<img class="person-avatar" src="' + person.avatar + '">';
container.innerHTML = html;  // Direct manipulation

peoplePanel.classList.remove("hidden");  // Direct manipulation
locationsPanel.classList.add("hidden");   // Direct manipulation
```

**Why This Conflicts:**
1. **React doesn't know about the changes** — If you manipulate the DOM directly, React's virtual DOM representation becomes stale/out-of-sync with the real DOM
2. **React will overwrite your changes** — On the next render, React regenerates based on its state/props and wipes out your manual edits
3. **State becomes inconsistent** — The DOM shows one thing, React's internal state shows another

**Example of Breaking React:**
```jsx
function MyComponent() {
  const [count, setCount] = useState(0);

  // ❌ NEVER DO THIS:
  useEffect(() => {
    document.querySelector("p").textContent = "Wrong!";  // Breaks React's tracking
  }, []);

  return <p>{count}</p>;  // React thinks this should render, but manual DOM edit overrode it
}
```

**The React Way:**
```jsx
function MyComponent() {
  const [count, setCount] = useState(0);

  // ✅ Let React manage the DOM via state/props
  return <p>{count}</p>;
}
```

**Key Principle:**
- **React = source of truth for state → React manages DOM**
- **DOM manipulation = breaking that contract**
- Conditional rendering, conditional classes, etc. all go through React's state/props system, not direct DOM edits

This is why React requires `className` instead of mutating `classList`, and why we use `{condition && <div>}` instead of `document.querySelector().classList.add("hidden")`.

---
