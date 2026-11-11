import type { CaseDataState } from "../../dashboard/useCaseData";
import { SORT_ORDERS } from "../../../../core/constants";
import type { EvidenceFilters } from "../filters";

interface EvidenceToolbarProps {
  data: CaseDataState;
  filters: EvidenceFilters;
  onChange: (changes: Partial<EvidenceFilters>) => void;
  onClear: () => void;
}

export function EvidenceToolbar({ data, filters, onChange, onClear }: EvidenceToolbarProps) {
  const types = [...new Set(data.evidence.map((item) => item.type.toLowerCase()))];
  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <label htmlFor="evidenceSearch" className="visually-hidden">
          Search evidence
        </label>
        <input
          id="evidenceSearch"
          type="text"
          placeholder="Search evidence by title, summary, or tag…"
          autoComplete="off"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
        />
        <label htmlFor="filterType" className="visually-hidden">
          Filter by type
        </label>
        <select
          id="filterType"
          value={filters.type}
          onChange={(event) => onChange({ type: event.target.value })}
        >
          <option value="">All types</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <label htmlFor="filterPerson" className="visually-hidden">
          Filter by person
        </label>
        <select
          id="filterPerson"
          value={filters.personId}
          onChange={(event) => onChange({ personId: event.target.value })}
        >
          <option value="">All people</option>
          {data.people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
        <label htmlFor="filterLocation" className="visually-hidden">
          Filter by location
        </label>
        <select
          id="filterLocation"
          value={filters.locationId}
          onChange={(event) => onChange({ locationId: event.target.value })}
        >
          <option value="">All locations</option>
          {data.locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.id} - {location.name}
            </option>
          ))}
        </select>
      </div>
      <div className="toolbar-row">
        <label htmlFor="filterStatus" className="visually-hidden">
          Filter by status
        </label>
        <select
          id="filterStatus"
          value={filters.status}
          onChange={(event) => onChange({ status: event.target.value })}
        >
          <option value="">All statuses</option>
          <option value="unreviewed">Unreviewed</option>
          <option value="reviewed">Reviewed</option>
          <option value="flagged">Flagged</option>
        </select>
        <label htmlFor="filterRelevance" className="visually-hidden">
          Filter by relevance
        </label>
        <select
          id="filterRelevance"
          value={filters.relevance}
          onChange={(event) => onChange({ relevance: event.target.value })}
        >
          <option value="">All relevance</option>
          <option value="unknown">Unknown</option>
          <option value="relevant">Relevant</option>
          <option value="irrelevant">Irrelevant</option>
        </select>
        <label htmlFor="sortEvidence" className="visually-hidden">
          Sort evidence
        </label>
        <select
          id="sortEvidence"
          value={filters.sort}
          onChange={(event) => {
            const value = event.target.value;
            const sort = Object.values(SORT_ORDERS).find((order) => order === value);
            if (sort) onChange({ sort });
            else console.error("Unknown evidence sort order:", value);
          }}
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="title-asc">Title (A–Z)</option>
          <option value="title-desc">Title (Z–A)</option>
        </select>
        <button type="button" className="btn btn-secondary" onClick={onClear}>
          Clear filters
        </button>
      </div>
    </div>
  );
}
