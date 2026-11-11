import { DEFAULT_SORT_ORDER, SORT_ORDERS } from "../../../core/constants";
import type { SortOrder } from "../../../core/constants";
import { evidenceMentionsPerson } from "../../../core/lookup";
import type { Evidence, Person } from "../../../core/types";

export interface EvidenceFilters {
  search: string;
  type: string;
  personId: string;
  locationId: string;
  status: string;
  relevance: string;
  sort: SortOrder;
}

export const DEFAULT_FILTERS: EvidenceFilters = {
  search: "",
  type: "",
  personId: "",
  locationId: "",
  status: "",
  relevance: "",
  sort: DEFAULT_SORT_ORDER,
};

/**
 * Demo 7: useReducer for evidence filters
 * Instead of separate useState calls for each filter, a single reducer manages all related state.
 */
export type EvidenceFilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_TYPE"; payload: string }
  | { type: "SET_PERSON"; payload: string }
  | { type: "SET_LOCATION"; payload: string }
  | { type: "SET_STATUS"; payload: string }
  | { type: "SET_RELEVANCE"; payload: string }
  | { type: "SET_SORT"; payload: SortOrder }
  | { type: "CLEAR_FILTERS" };

export function evidenceFiltersReducer(
  state: EvidenceFilters,
  action: EvidenceFilterAction
): EvidenceFilters {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_PERSON":
      return { ...state, personId: action.payload };
    case "SET_LOCATION":
      return { ...state, locationId: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_RELEVANCE":
      return { ...state, relevance: action.payload };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    case "CLEAR_FILTERS":
      return DEFAULT_FILTERS;
    default:
      return state;
  }
}

const comparators: Record<SortOrder, (a: Evidence, b: Evidence) => number> = {
  [SORT_ORDERS.TITLE_ASC]: (a, b) => a.title.localeCompare(b.title),
  [SORT_ORDERS.TITLE_DESC]: (a, b) => b.title.localeCompare(a.title),
  [SORT_ORDERS.DATE_ASC]: (a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  [SORT_ORDERS.DATE_DESC]: (a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
};

export function selectEvidence(
  evidence: Evidence[],
  people: Person[],
  filters: EvidenceFilters
): Evidence[] {
  const search = filters.search.trim().toLowerCase();
  const person = people.find((item) => item.id === filters.personId);
  return evidence
    .filter(
      (item) =>
        `${item.title} ${item.summary} ${item.tags.join(" ")}`.toLowerCase().includes(search) &&
        (!filters.type || item.type.toLowerCase() === filters.type) &&
        (!filters.personId || (person !== undefined && evidenceMentionsPerson(item, person))) &&
        (!filters.locationId || item.locationIds.includes(filters.locationId)) &&
        (!filters.status || item.status.toLowerCase() === filters.status) &&
        (!filters.relevance || item.relevance.toLowerCase() === filters.relevance)
    )
    .sort(comparators[filters.sort]);
}
