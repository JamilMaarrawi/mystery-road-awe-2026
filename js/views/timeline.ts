// Timeline view.
import { state } from "../core/state.js";
import { locationLabel } from "../core/lookup.js";
import { formatDate, certaintyBadgeClass } from "../utils/format.js";
import { openEvidenceModal } from "../ui/modal.js";

export function renderTimeline(): void {
  const container = document.getElementById("timelineContainer");
  if (!container) return;

  const order = (document.getElementById("timelineOrder") as HTMLSelectElement).value;
  const personFilter = (document.getElementById("timelinePersonFilter") as HTMLSelectElement).value;
  const locationFilter = (document.getElementById("timelineLocationFilter") as HTMLSelectElement)
    .value;
  const typeFilter = (document.getElementById("timelineTypeFilter") as HTMLSelectElement).value;

  const events = state.allTimeline
    .filter(
      (evt) =>
        (!personFilter || evt.personIds.includes(personFilter)) &&
        (!locationFilter || evt.locationIds.includes(locationFilter)) &&
        (!typeFilter || evt.type === typeFilter)
    )
    .sort((a, b) => {
      const diff = new Date(a.time).getTime() - new Date(b.time).getTime();
      return order === "desc" ? -diff : diff;
    });

  let html = "";
  for (const item of events) {
    html += '<div class="timeline-event certainty-' + item.certainty + '">';
    html +=
      '<div class="timeline-time">' +
      formatDate(item.time) +
      '&nbsp;&middot;&nbsp;<span class="badge badge-' +
      certaintyBadgeClass(item.certainty) +
      '">' +
      item.certainty +
      "</span></div>";
    html += "<h3>" + item.title + "</h3>";
    html += "<p>" + item.description + "</p>";

    const eventLocationNames = item.locationIds.map(locationLabel);
    if (eventLocationNames.length > 0) {
      html += '<p class="evidence-meta">Location: ' + eventLocationNames.join(", ") + "</p>";
    }

    for (const evidenceId of item.evidenceIds) {
      html +=
        '<button type="button" class="evidence-link-btn" data-evidence-id="' +
        evidenceId +
        '">View ' +
        evidenceId +
        "</button>";
    }
    html += "</div>";
  }
  if (events.length === 0) {
    html = "<p>No timeline events match the current filters.</p>";
  }
  container.innerHTML = html;

  container.querySelectorAll<HTMLElement>(".evidence-link-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      const evidenceId = (event.target as HTMLElement).getAttribute("data-evidence-id");
      if (evidenceId) openEvidenceModal(evidenceId);
    });
  });
}
