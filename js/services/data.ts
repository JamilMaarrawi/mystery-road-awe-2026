// All network access stuff
import { state } from "../core/state.js";
import type { CaseData, Person, Location, Evidence, TimelineEvent } from "../core/types.js";
import { renderDashboard } from "../views/dashboard.js";
import { populateAllDropdowns } from "../ui/dropdowns.js";
import { applyStoredBookmarkFlags, renderEvidenceList } from "../views/evidence.js";
import { renderTimeline } from "../views/timeline.js";

function showLoadingOverlay(msg: string, failed = false): void {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  overlay?.classList.remove("hidden");
  if (failed) overlay?.classList.add("loading-failed");
}

function hideLoadingOverlay(): void {
  document.getElementById("loadingOverlay")?.classList.add("hidden");
}

// A type assertion, not a validation. The JSON is trusted to match T.
async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  // fetch() only rejects on network errors, so check the HTTP status too.
  if (!res.ok) {
    throw new Error("Could not load " + path + " (HTTP " + res.status + ")");
  }
  return (await res.json()) as T;
}

async function loadCorePeopleAndLocations(): Promise<void> {
  state.caseData = await fetchJson<CaseData>("data/case.json");
  state.allPeople = await fetchJson<Person[]>("data/people.json");
  state.allLocations = await fetchJson<Location[]>("data/locations.json");

  // Evidence and timeline have not loaded yet, so some counts briefly read 0.
  renderDashboard();
  populateAllDropdowns();
}

async function loadEvidenceData(): Promise<void> {
  try {
    state.allEvidence = await fetchJson<Evidence[]>("data/evidence.json");
    applyStoredBookmarkFlags();
    renderDashboard();
    populateAllDropdowns();
  } catch (err) {
    console.error("Failed to load evidence.json", err);
    alert("Evidence could not be loaded. Some views may be incomplete.");
  } finally {
    state.evidenceViewLoading = false;
    if (state.currentPage === "evidence") renderEvidenceList();
  }
}

async function loadTimelineData(): Promise<void> {
  try {
    state.allTimeline = await fetchJson<TimelineEvent[]>("data/timeline.json");
    renderDashboard();
    if (state.currentPage === "timeline") renderTimeline();
    populateAllDropdowns();
  } catch (err) {
    console.error("Failed to load timeline.json", err);
  } finally {
    hideLoadingOverlay();
  }
}

export async function loadAllData(): Promise<void> {
  showLoadingOverlay("Loading case file…");

  try {
    await loadCorePeopleAndLocations();
  } catch (err) {
    console.error("Failed to load the core case file", err);
    const message = err instanceof Error ? err.message : String(err);
    showLoadingOverlay(message + " - the case file could not be opened.", true);
    return;
  }

  // Fire-and-forget. Each loader has its own try/catch.
  void loadEvidenceData();
  void loadTimelineData();
}
