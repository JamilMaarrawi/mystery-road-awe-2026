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
