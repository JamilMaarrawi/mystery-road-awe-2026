// Evidence catalogue: list, filtering, sorting, bookmarking and the inline detail panel.
import { state } from "../core/state.js";
import { navigateTo } from "../app/nav.js";
import {
  findEvidenceById,
  findPersonById,
  locationLabel,
  evidenceMentionsPerson,
} from "../core/lookup.js";
import { formatDate, getStatusBadgeClass, getRelevanceBadgeClass } from "../utils/format.js";
import {
  saveBookmarksToStorage,
  saveNoteForEvidence,
  loadNoteForEvidence,
} from "../services/storage.js";
import { escapeHtml } from "../utils/html.js";
import { STATUS, RELEVANCE, SORT_ORDERS, DEFAULT_SORT_ORDER } from "../core/constants.js";
import type { Evidence, EvidenceId } from "../core/types.js";
import type { SortOrder, StatusValue, RelevanceValue } from "../core/constants.js";

interface EvidenceQuery {
  search: string;
  type: string;
  personId: string;
  locationId: string;
  status: string;
  relevance: string;
  sort: string;
}

// Reads the toolbar's current filters from the DOM.
function readEvidenceQuery(): EvidenceQuery {
  const searchBox = document.getElementById("evidenceSearch") as HTMLInputElement | null;
  return {
    search: searchBox ? searchBox.value.toLowerCase().trim() : "",
    type: (document.getElementById("filterType") as HTMLSelectElement).value,
    personId: (document.getElementById("filterPerson") as HTMLSelectElement).value,
    locationId: (document.getElementById("filterLocation") as HTMLSelectElement).value,
    status: (document.getElementById("filterStatus") as HTMLSelectElement).value,
    relevance: (document.getElementById("filterRelevance") as HTMLSelectElement).value,
    sort: (document.getElementById("sortEvidence") as HTMLSelectElement).value,
  };
}

const COMPARATORS: Record<SortOrder, (a: Evidence, b: Evidence) => number> = {
  [SORT_ORDERS.TITLE_ASC]: (a, b) => a.title.localeCompare(b.title),
  [SORT_ORDERS.TITLE_DESC]: (a, b) => b.title.localeCompare(a.title),
  [SORT_ORDERS.DATE_ASC]: (a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  [SORT_ORDERS.DATE_DESC]: (a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
};

function matchesQuery(item: Evidence, query: EvidenceQuery): boolean {
  if (query.search) {
    const haystack = (item.title + " " + item.summary + " " + item.tags.join(" ")).toLowerCase();
    if (!haystack.includes(query.search)) return false;
  }
  if (query.type && item.type.toLowerCase() !== query.type) return false;
  if (query.personId) {
    const person = findPersonById(query.personId);
    if (!person || !evidenceMentionsPerson(item, person)) return false;
  }
  if (query.locationId && !item.locationIds.includes(query.locationId)) return false;
  if (query.status && (item.status || "").toLowerCase() !== query.status) return false;
  if (query.relevance && (item.relevance || "").toLowerCase() !== query.relevance) return false;
  return true;
}

function selectEvidence(query: EvidenceQuery): Evidence[] {
  const results = state.allEvidence.filter((item) => matchesQuery(item, query));
  return results.sort(COMPARATORS[query.sort as SortOrder] || COMPARATORS[DEFAULT_SORT_ORDER]);
}

export function renderEvidenceList(): void {
  const container = document.getElementById("evidenceList");
  if (!container) return;

  const loadingIndicator = document.getElementById("evidenceLoadingIndicator");
  if (state.evidenceViewLoading) {
    if (loadingIndicator) loadingIndicator.classList.remove("hidden");
    container.innerHTML = "";
    return;
  }
  if (loadingIndicator) loadingIndicator.classList.add("hidden");

  const results = selectEvidence(readEvidenceQuery());

  let html = "";
  if (results.length === 0) {
    html = "<p>No evidence matches the current filters.</p>";
  }
  for (const ev of results) {
    html += renderEvidenceCardHTML(ev);
  }
  container.innerHTML = html;
}

function tagChipsHTML(tags: string[]): string {
  return tags.map((tag) => '<span class="tag-chip">' + tag + "</span>").join("");
}

function renderEvidenceCardHTML(ev: Evidence): string {
  const isBookmarked = state.bookmarks.includes(ev.id);
  let html = '<div class="evidence-card" data-id="' + ev.id + '">';
  html +=
    '<button class="bookmark-btn ' +
    (isBookmarked ? "active" : "") +
    '" data-action="bookmark" data-id="' +
    ev.id +
    '" aria-label="Toggle bookmark for ' +
    ev.title +
    '"><span class="bookmark-icon">' +
    (isBookmarked ? "★" : "☆") +
    "</span></button>";
  html += "<h3>" + ev.title + "</h3>";
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div>";
  html += '<div class="evidence-summary">' + ev.summary + "</div>";

  if (ev.tags.includes("critical")) {
    html += '<span class="badge badge-critical">Critical</span>';
  }
  html += '<span class="badge ' + getStatusBadgeClass(ev.status) + '">' + ev.status + "</span>";
  html +=
    '<span class="badge ' + getRelevanceBadgeClass(ev.relevance) + '">' + ev.relevance + "</span>";
  html += "<div>" + tagChipsHTML(ev.tags) + "</div>";
  html += "</div>";
  return html;
}

// Delegated handler for card and bookmark clicks.
export function handleEvidenceListClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;

  // The click target is often the star <span> inside the button.
  const bookmarkBtn = target.closest<HTMLElement>('[data-action="bookmark"]');
  if (bookmarkBtn) {
    event.stopPropagation();
    const id = bookmarkBtn.dataset.id;
    if (id) handleBookmarkClick(id);
    return;
  }

  const card = target.closest(".evidence-card");
  const id = card?.getAttribute("data-id");
  if (id) openEvidenceDetail(id);
}

function handleBookmarkClick(evidenceId: EvidenceId): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  if (!state.bookmarks.includes(evidenceId)) {
    state.bookmarks.push(evidenceId);
    ev.bookmarked = true;
  } else {
    state.bookmarks = state.bookmarks.filter((id) => id !== evidenceId);
    ev.bookmarked = false;
  }
  saveBookmarksToStorage();
  if (state.currentPage === "evidence") renderEvidenceList();
}

export function applyStoredBookmarkFlags(): void {
  state.allEvidence.forEach((ev) => {
    ev.bookmarked = state.bookmarks.includes(ev.id);
  });
}

export function clearFilters(): void {
  (document.getElementById("evidenceSearch") as HTMLInputElement).value = "";
  (document.getElementById("filterType") as HTMLSelectElement).value = "";
  (document.getElementById("filterPerson") as HTMLSelectElement).value = "";
  (document.getElementById("filterLocation") as HTMLSelectElement).value = "";
  (document.getElementById("filterStatus") as HTMLSelectElement).value = "";
  (document.getElementById("filterRelevance") as HTMLSelectElement).value = "";
  renderEvidenceList();
}

function openEvidenceDetail(evidenceId: EvidenceId): void {
  const ev = findEvidenceById(evidenceId);
  if (!ev) return;

  const section = document.getElementById("evidenceDetailSection")!;
  section.classList.remove("hidden");

  renderEvidenceDetail(ev);
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Switches to the Evidence view and opens one item's detail panel.
export function showEvidence(evidenceId: EvidenceId): void {
  navigateTo("evidence");
  // The view stays hidden until the hashchange renders it, so scrolling has to wait.
  setTimeout(() => openEvidenceDetail(evidenceId), 0);
}

// Delegated handler for the detail panel, whose markup is rebuilt on every render.
export function handleEvidenceDetailClick(event: MouseEvent): void {
  const actionEl = (event.target as HTMLElement).closest<HTMLElement>("[data-action]");
  if (!actionEl) return;

  if (actionEl.dataset.action === "close-detail") {
    closeEvidenceDetail();
  } else if (actionEl.dataset.action === "save-note") {
    saveCurrentNote();
  }
}

function closeEvidenceDetail(): void {
  const section = document.getElementById("evidenceDetailSection")!;
  section.classList.add("hidden");
  section.innerHTML = "";
}

function renderEvidenceDetail(ev: Evidence): void {
  const section = document.getElementById("evidenceDetailSection")!;

  // Falls back to the stored value, which for E04 is already a display name.
  const personNames = ev.personIds.map((ref) => findPersonById(ref)?.name ?? ref);
  const locationNames = ev.locationIds.map(locationLabel);

  const storedNote = loadNoteForEvidence(ev.id);

  let html = "";
  html += '<div class="evidence-detail-header">';
  html += "<div><h2>" + ev.title + "</h2>";
  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div></div>";
  html +=
    '<button type="button" class="btn btn-secondary btn-small" data-action="close-detail">Close</button>';
  html += "</div>";

  if (ev.tags.includes("critical")) {
    html += '<div class="warning-banner">This item is tagged as critical evidence.</div>';
  }

  html += '<div class="detail-field"><strong>Summary</strong>' + ev.summary + "</div>";
  html += '<div class="evidence-detail-content">' + ev.content + "</div>";
  html +=
    '<div class="detail-field"><strong>Related people</strong>' + personNames.join(", ") + "</div>";
  html +=
    '<div class="detail-field"><strong>Related locations</strong>' +
    locationNames.join(", ") +
    "</div>";
  html += '<div class="detail-field"><strong>Tags</strong>' + tagChipsHTML(ev.tags) + "</div>";

  html += '<div class="detail-field"><strong>Review status</strong>';
  html += '<select id="detailStatusSelect">';
  html += statusOptionHTML(ev.status, STATUS.UNREVIEWED, "Unreviewed");
  html += statusOptionHTML(ev.status, STATUS.REVIEWED, "Reviewed");
  html += statusOptionHTML(ev.status, STATUS.FLAGGED, "Flagged");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Relevance</strong>';
  html += '<select id="detailRelevanceSelect">';
  html += statusOptionHTML(ev.relevance, RELEVANCE.UNKNOWN, "Unknown");
  html += statusOptionHTML(ev.relevance, RELEVANCE.RELEVANT, "Relevant");
  html += statusOptionHTML(ev.relevance, RELEVANCE.IRRELEVANT, "Irrelevant");
  html += "</select></div>";

  html += '<div class="detail-field"><strong>Investigator note</strong>';
  // Notes are user input, so they are escaped before going into innerHTML.
  html +=
    '<textarea id="evidenceNoteInput" class="note-textarea" rows="3" data-evidence-id="' +
    ev.id +
    '" placeholder="Add a private note about this evidence...">' +
    escapeHtml(storedNote) +
    "</textarea>";
  html +=
    '<button type="button" class="btn btn-primary btn-small" style="margin-top:6px;" data-action="save-note">Save note</button>';
  html += "</div>";

  html +=
    '<div class="detail-field"><strong>Note preview</strong><div id="notePreview">' +
    escapeHtml(storedNote) +
    "</div></div>";

  section.innerHTML = html;

  document.getElementById("detailStatusSelect")!.addEventListener("change", (event) => {
    ev.status = (event.target as HTMLSelectElement).value as StatusValue;
    renderEvidenceDetail(ev);
    if (state.currentPage === "evidence") renderEvidenceList();
  });
  document.getElementById("detailRelevanceSelect")!.addEventListener("change", (event) => {
    ev.relevance = (event.target as HTMLSelectElement).value as RelevanceValue;
    renderEvidenceDetail(ev);
    if (state.currentPage === "evidence") renderEvidenceList();
  });
}

function statusOptionHTML(current: string, value: string, label: string): string {
  const currentLower = (current || "").toLowerCase();
  const selected = currentLower === value ? " selected" : "";
  return '<option value="' + value + '"' + selected + ">" + label + "</option>";
}

function saveCurrentNote(): void {
  const textarea = document.getElementById("evidenceNoteInput") as HTMLTextAreaElement | null;
  if (!textarea) return;
  const evidenceId = textarea.getAttribute("data-evidence-id");
  const text = textarea.value;
  if (evidenceId) saveNoteForEvidence(evidenceId, text);
  const preview = document.getElementById("notePreview");
  // textContent shows the note as typed, never as markup.
  if (preview) preview.textContent = text;
}
