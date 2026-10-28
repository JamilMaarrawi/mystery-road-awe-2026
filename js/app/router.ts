// Hash-based routing. Decides which view is visible and re-renders it on entry.
import { state } from "../core/state.js";
import { DEFAULT_VIEW, isViewName } from "../core/constants.js";
import { renderDashboard } from "../views/dashboard.js";
import { renderEvidenceList } from "../views/evidence.js";
import { renderPeople, renderLocations } from "../views/people.js";
import { renderTimeline } from "../views/timeline.js";
import { renderWorkspace } from "../views/workspace.js";

export function handleHashChange(): void {
  const rawHash = window.location.hash.replace("#", "");
  const hash = isViewName(rawHash) ? rawHash : DEFAULT_VIEW;
  state.currentPage = hash;

  document.querySelectorAll(".view").forEach((section) => section.classList.remove("active"));
  document.getElementById("view-" + hash)!.classList.add("active");

  document.querySelectorAll<HTMLElement>(".nav-btn").forEach((button) => {
    button.classList.remove("active");
    if (button.getAttribute("data-view") === hash) {
      button.classList.add("active");
    }
  });

  if (hash === "dashboard") {
    renderDashboard();
  } else if (hash === "evidence") {
    renderEvidenceList();
  } else if (hash === "people") {
    renderPeople();
    renderLocations();
  } else if (hash === "timeline") {
    renderTimeline();
  } else if (hash === "workspace") {
    renderWorkspace();
  }
}
