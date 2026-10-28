// Quick-view modal, opened from the timeline.
import { findEvidenceById } from "../core/lookup.js";
import { formatDate } from "../utils/format.js";
import { showEvidence } from "../views/evidence.js";
import type { EvidenceId } from "../core/types.js";

export function openEvidenceModal(evidenceId: EvidenceId): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  let modal = document.getElementById("quickViewModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "quickViewModal";
    document.body.appendChild(modal);
    modal.addEventListener("click", handleModalClick);
  }

  modal.innerHTML =
    '<div class="modal-backdrop"><div class="modal-box">' +
    '<button type="button" class="modal-close-btn" aria-label="Close">&times;</button>' +
    "<h3>" +
    ev.title +
    "</h3>" +
    '<p class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</p>" +
    "<p>" +
    ev.summary +
    "</p>" +
    '<button type="button" class="btn btn-primary btn-small" data-open-full="' +
    ev.id +
    '">Open full evidence</button>' +
    "</div></div>";
}

function handleModalClick(e: MouseEvent): void {
  const modal = e.currentTarget as HTMLElement;
  const target = e.target as HTMLElement;

  if (target.classList.contains("modal-close-btn") || target.classList.contains("modal-backdrop")) {
    modal.innerHTML = "";
  }
  const evidenceId = target.getAttribute("data-open-full");
  if (evidenceId) {
    modal.innerHTML = "";
    showEvidence(evidenceId);
  }
}
