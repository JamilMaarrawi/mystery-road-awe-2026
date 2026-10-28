// Fills every <select> in the page from the loaded case data.
import { state } from "../core/state.js";

type SelectOption = [value: string, label: string];

function fillSelect(id: string, firstLabel: string | null, options: SelectOption[]): void {
  const select = document.getElementById(id) as HTMLSelectElement | null;
  if (!select) return;
  const first = firstLabel === null ? "" : '<option value="">' + firstLabel + "</option>";
  select.innerHTML =
    first +
    options
      .map(([value, label]) => '<option value="' + value + '">' + label + "</option>")
      .join("");
}

const unique = (values: string[]): string[] => [...new Set(values)];

function personOptions(): SelectOption[] {
  return state.allPeople.map((p) => [p.id, p.name]);
}

export function populateAllDropdowns(): void {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}

function populateEvidenceDropdowns(): void {
  const types = unique(state.allEvidence.map((ev) => ev.type.toLowerCase()));
  fillSelect(
    "filterType",
    "All types",
    types.map((t) => [t, t])
  );
  fillSelect("filterPerson", "All people", personOptions());
  fillSelect(
    "filterLocation",
    "All locations",
    state.allLocations.map((l) => [l.id, l.id + " - " + l.name])
  );
}

function populateTimelineDropdowns(): void {
  const types = unique(state.allTimeline.map((ev) => ev.type));
  fillSelect("timelinePersonFilter", "All people", personOptions());
  fillSelect(
    "timelineLocationFilter",
    "All locations",
    state.allLocations.map((l) => [l.id, l.id])
  );
  fillSelect(
    "timelineTypeFilter",
    "All event types",
    types.map((t) => [t, t])
  );
}

export function populateHypothesisDropdowns(): void {
  const suspectSelect = document.getElementById("hypSuspect") as HTMLSelectElement | null;
  const currentSuspect = suspectSelect?.value ?? "";
  fillSelect("hypSuspect", "Select a person…", personOptions());
  if (suspectSelect) suspectSelect.value = currentSuspect;

  fillSelect(
    "hypEvidence",
    null,
    state.allEvidence.map((ev) => [ev.id, ev.id + " - " + ev.title])
  );
}
