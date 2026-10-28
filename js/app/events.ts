// All DOM event listeners are registered here.
// index.html has no inline handlers.
import { handleHashChange } from "./router.js";
import { navigateTo } from "./nav.js";
import {
  renderEvidenceList,
  clearFilters,
  handleEvidenceListClick,
  handleEvidenceDetailClick,
} from "../views/evidence.js";
import { renderTimeline } from "../views/timeline.js";
import { handlePeopleTabClick } from "../views/people.js";
import { saveHypothesis } from "../views/workspace.js";
import { isViewName } from "../core/constants.js";

export function setupEventListeners(): void {
  window.addEventListener("hashchange", handleHashChange);

  // navigation
  document.querySelectorAll<HTMLElement>(".nav-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const view = (event.currentTarget as HTMLElement).dataset.view;
      if (view && isViewName(view)) navigateTo(view);
    });
  });

  // shortcut buttons on the dashboard
  document.querySelectorAll<HTMLElement>("[data-nav]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const view = (event.currentTarget as HTMLElement).dataset.nav;
      if (view && isViewName(view)) navigateTo(view);
    });
  });

  // --- Evidence view ---------------------------------------------------
  document.getElementById("evidenceSearch")!.addEventListener("input", renderEvidenceList);

  [
    "filterType",
    "filterPerson",
    "filterLocation",
    "filterStatus",
    "filterRelevance",
    "sortEvidence",
  ].forEach((id) => document.getElementById(id)!.addEventListener("change", renderEvidenceList));

  document.getElementById("clearFiltersBtn")!.addEventListener("click", clearFilters);
  document.getElementById("evidenceList")!.addEventListener("click", handleEvidenceListClick);
  document
    .getElementById("evidenceDetailSection")!
    .addEventListener("click", handleEvidenceDetailClick);

  // --- People & Locations ----------------------------------------------
  document
    .querySelectorAll("[data-people-tab]")
    .forEach((button) => button.addEventListener("click", handlePeopleTabClick as EventListener));

  // --- Timeline ---------------------------------------------------------
  ["timelineOrder", "timelinePersonFilter", "timelineLocationFilter", "timelineTypeFilter"].forEach(
    (id) => document.getElementById(id)!.addEventListener("change", renderTimeline)
  );

  // --- Workspace --------------------------------------------------------
  document.getElementById("saveHypothesisBtn")!.addEventListener("click", saveHypothesis);
  document.getElementById("hypConfidence")!.addEventListener("input", (event) => {
    document.getElementById("hypConfidenceValue")!.textContent = (
      event.target as HTMLInputElement
    ).value;
  });
}
