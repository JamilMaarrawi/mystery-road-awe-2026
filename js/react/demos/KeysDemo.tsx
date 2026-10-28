import { useState } from "react";

// Throwaway Demo 4 page (open /keys-demo.html in the dev server).
// Switch this one value to see the bug (true) or the fix (false).
const USE_INDEX_KEY = false;

interface Row {
  id: string;
  name: string;
}

const INITIAL_ROWS: Row[] = [
  { id: "nova-byte", name: "Nova Byte" },
  { id: "patch-vector", name: "Patch Vector" },
  { id: "root-harbor", name: "Root Harbor" },
];

interface DemoRowProps {
  name: string;
}

// The note lives in this component's own state, so it belongs to whichever
// component instance React keeps for this row.
function DemoRow({ name }: DemoRowProps) {
  const [note, setNote] = useState("");

  return (
    <li style={{ marginBottom: 8 }}>
      <strong style={{ display: "inline-block", width: 120 }}>{name}</strong>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="type a note..."
      />
    </li>
  );
}

export function KeysDemo() {
  const [rows, setRows] = useState<Row[]>(INITIAL_ROWS);

  return (
    <main className="app-main">
      <h2>Demo 4 &mdash; list keys</h2>
      <p>
        Current key:{" "}
        <strong>{USE_INDEX_KEY ? "key={index} (wrong)" : "key={row.id} (correct)"}</strong>
      </p>
      <p>Type a different note into each row, then reverse or remove the first row.</p>

      <button type="button" onClick={() => setRows((prev) => [...prev].reverse())}>
        Reverse order
      </button>{" "}
      <button type="button" onClick={() => setRows((prev) => prev.slice(1))}>
        Remove first
      </button>{" "}
      <button type="button" onClick={() => setRows(INITIAL_ROWS)}>
        Reset
      </button>

      <ul style={{ listStyle: "none", padding: 0, marginTop: 16 }}>
        {rows.map((row, index) => (
          <DemoRow key={USE_INDEX_KEY ? index : row.id} name={row.name} />
        ))}
      </ul>
    </main>
  );
}
