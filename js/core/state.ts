// Shared application state. Modules read and write its fields directly.
import type { Evidence, Person, Location, TimelineEvent, CaseData, EvidenceId } from "./types.js";
import type { ViewName } from "./constants.js";

interface AppState {
  allEvidence: Evidence[];
  allPeople: Person[];
  allLocations: Location[];
  allTimeline: TimelineEvent[];
  caseData: CaseData | null;
  bookmarks: EvidenceId[];
  notesStore: Record<EvidenceId, string>; // mirrored to localStorage
  currentPage: ViewName;
  evidenceViewLoading: boolean; // blocks only the Evidence view, not the whole app
}

export const state: AppState = {
  allEvidence: [],
  allPeople: [],
  allLocations: [],
  allTimeline: [],
  caseData: null,
  bookmarks: [],
  notesStore: {},
  currentPage: "dashboard",
  evidenceViewLoading: true,
};
