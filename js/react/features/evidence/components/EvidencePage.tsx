import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { CaseDataState } from "../../dashboard/useCaseData";
import { readNotes, writeNotes } from "../../../../services/storage";
import { DEFAULT_FILTERS, selectEvidence } from "../filters";
import type { EvidenceFilters } from "../filters";
import { EvidenceCard } from "./EvidenceCard";
import { EvidenceDetail } from "./EvidenceDetail";
import { EvidenceToolbar } from "./EvidenceToolbar";

interface EvidencePageProps {
  data: CaseDataState;
  bookmarks: readonly string[];
  onToggleBookmark: (id: string) => void;
  bookmarkError: string | null;
}

export function EvidencePage({
  data,
  bookmarks,
  onToggleBookmark,
  bookmarkError,
}: EvidencePageProps) {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<EvidenceFilters>(DEFAULT_FILTERS);
  const [notes, setNotes] = useState(readNotes);
  const [selectedId, setSelectedId] = useState<string | null>(() => searchParams.get("item"));
  const [storageError, setStorageError] = useState<string | null>(null);

  const results = selectEvidence(data.evidence, data.people, filters);
  const selectedEvidence = data.evidence.find((item) => item.id === selectedId);

  function saveNote(id: string, text: string): boolean {
    const updated = { ...notes, [id]: text };
    try {
      writeNotes(updated);
      setNotes(updated);
      setStorageError(null);
      return true;
    } catch (error) {
      console.error("Could not save evidence note", error);
      setStorageError("Could not save the note to local storage.");
      return false;
    }
  }

  return (
    <section className="view active">
      <h2>Evidence Catalogue</h2>
      <EvidenceToolbar
        data={data}
        filters={filters}
        onChange={(changes) => setFilters((current) => ({ ...current, ...changes }))}
        onClear={() => setFilters(DEFAULT_FILTERS)}
      />
      {bookmarkError && <p role="alert">{bookmarkError}</p>}
      {storageError && <p role="alert">{storageError}</p>}
      {data.evidenceStatus === "loading" && <p>Loading evidence...</p>}
      {data.evidenceStatus === "error" && <p>Could not load evidence.</p>}
      {data.evidenceStatus === "ready" &&
        (results.length === 0 ? (
          <p>No evidence matches the current filters.</p>
        ) : (
          <div className="evidence-grid">
            {results.map((item) => (
              <EvidenceCard
                key={item.id}
                evidence={item}
                bookmarked={bookmarks.includes(item.id)}
                onBookmark={() => onToggleBookmark(item.id)}
                onOpen={() => setSelectedId(item.id)}
              />
            ))}
          </div>
        ))}
      {selectedEvidence && (
        <EvidenceDetail
          key={selectedEvidence.id}
          evidence={selectedEvidence}
          people={data.people}
          locations={data.locations}
          note={notes[selectedEvidence.id] ?? ""}
          onSaveNote={saveNote}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  );
}
