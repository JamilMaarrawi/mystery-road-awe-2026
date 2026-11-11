import { useReducer, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { CaseDataState } from "../../dashboard/useCaseData";
import { DEFAULT_FILTERS, selectEvidence, evidenceFiltersReducer } from "../filters";
import type { EvidenceFilters } from "../filters";
import { EvidenceCard } from "./EvidenceCard";
import { EvidenceDetail } from "./EvidenceDetail";
import { EvidenceToolbar } from "./EvidenceToolbar";

interface EvidencePageProps {
  data: CaseDataState;
  bookmarks: readonly string[];
  onToggleBookmark: (id: string) => void;
  bookmarkError: string | null;
  notes: Record<string, string>;
  onSaveNote: (id: string, text: string) => boolean;
  storageError: string | null;
}

export function EvidencePage({
  data,
  bookmarks,
  onToggleBookmark,
  bookmarkError,
  notes,
  onSaveNote,
  storageError,
}: EvidencePageProps) {
  const [searchParams] = useSearchParams();
  const [filters, dispatch] = useReducer(evidenceFiltersReducer, DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(() => searchParams.get("item"));

  const results = selectEvidence(data.evidence, data.people, filters);
  const selectedEvidence = data.evidence.find((item) => item.id === selectedId);

  function handleFilterChange(changes: Partial<EvidenceFilters>): void {
    if ("search" in changes) dispatch({ type: "SET_SEARCH", payload: changes.search ?? "" });
    if ("type" in changes) dispatch({ type: "SET_TYPE", payload: changes.type ?? "" });
    if ("personId" in changes) dispatch({ type: "SET_PERSON", payload: changes.personId ?? "" });
    if ("locationId" in changes) dispatch({ type: "SET_LOCATION", payload: changes.locationId ?? "" });
    if ("status" in changes) dispatch({ type: "SET_STATUS", payload: changes.status ?? "" });
    if ("relevance" in changes) dispatch({ type: "SET_RELEVANCE", payload: changes.relevance ?? "" });
    if ("sort" in changes) dispatch({ type: "SET_SORT", payload: changes.sort ?? DEFAULT_FILTERS.sort });
  }

  return (
    <section className="view active">
      <h2>Evidence Catalogue</h2>
      <EvidenceToolbar
        data={data}
        filters={filters}
        onChange={handleFilterChange}
        onClear={() => dispatch({ type: "CLEAR_FILTERS" })}
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
          onSaveNote={onSaveNote}
          onClose={() => setSelectedId(null)}
        />
      )}
    </section>
  );
}
