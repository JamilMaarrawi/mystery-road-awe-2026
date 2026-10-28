// Investigator workspace: bookmarks, notes and the hypothesis draft form.
import { state } from "../core/state.js";
import { readHypothesisDraft, saveHypothesisDraft } from "../services/storage.js";
import type { HypothesisDraft } from "../services/storage.js";
import { populateHypothesisDropdowns } from "../ui/dropdowns.js";
import { showEvidence } from "./evidence.js";
import { escapeHtml } from "../utils/html.js";
import { SAVED_MESSAGE_MS } from "../core/constants.js";

export function renderWorkspace(): void {
  renderBookmarksList();
  renderNotesList();
  populateHypothesisDropdowns();
  loadHypothesisFromStorage();
}

function renderBookmarksList(): void {
  const container = document.getElementById("bookmarksList");
  if (!container) return;

  const bookmarkedItems = state.allEvidence.filter((ev) => ev.bookmarked);

  if (bookmarkedItems.length === 0) {
    container.innerHTML =
      "<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>";
    return;
  }

  let html = "";
  for (const ev of bookmarkedItems) {
    html +=
      '<div class="mini-list-item"><strong>' +
      ev.id +
      "</strong> &mdash; " +
      ev.title +
      ' <button type="button" class="btn btn-small btn-secondary" data-open-evidence="' +
      ev.id +
      '">Open</button></div>';
  }
  container.innerHTML = html;

  container.querySelectorAll<HTMLElement>("[data-open-evidence]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = (event.target as HTMLElement).getAttribute("data-open-evidence");
      if (id) showEvidence(id);
    });
  });
}

function renderNotesList(): void {
  const container = document.getElementById("notesList");
  if (!container) return;

  const noteEntries: { evidenceId: string; title: string; text: string }[] = [];
  for (const ev of state.allEvidence) {
    const note = state.notesStore[ev.id];
    if (note) {
      noteEntries.push({ evidenceId: ev.id, title: ev.title, text: note });
    }
  }

  if (noteEntries.length === 0) {
    container.innerHTML = "<p>No notes yet. Add one from an evidence item's detail view.</p>";
    return;
  }

  let html = "";
  for (const entry of noteEntries) {
    html +=
      '<div class="mini-list-item"><strong>' +
      entry.evidenceId +
      "</strong> &mdash; " +
      entry.title;
    html += '<div class="note-text">' + escapeHtml(entry.text) + "</div></div>";
  }
  container.innerHTML = html;
}

export function saveHypothesis(): void {
  const draft: HypothesisDraft = {
    suspectId: (document.getElementById("hypSuspect") as HTMLSelectElement).value,
    nature: (document.getElementById("hypNature") as HTMLSelectElement).value,
    evidenceIds: getSelectedOptions(document.getElementById("hypEvidence") as HTMLSelectElement),
    confidence: (document.getElementById("hypConfidence") as HTMLInputElement).value,
    explanation: (document.getElementById("hypExplanation") as HTMLTextAreaElement).value,
    alternative: (document.getElementById("hypAlternative") as HTMLTextAreaElement).value,
    savedAt: new Date().toISOString(),
  };

  try {
    saveHypothesisDraft(draft);
  } catch (err) {
    console.error("Could not save hypothesis draft", err);
    alert("Your hypothesis could not be saved to local storage.");
    return;
  }

  const msg = document.getElementById("hypothesisSavedMsg")!;
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), SAVED_MESSAGE_MS);
}

function getSelectedOptions(selectEl: HTMLSelectElement): string[] {
  const result: string[] = [];
  for (const option of selectEl.options) {
    if (option.selected) result.push(option.value);
  }
  return result;
}

// Restores the saved draft into the form, if there is one.
function loadHypothesisFromStorage(): void {
  const draft = readHypothesisDraft();
  if (!draft) return;

  (document.getElementById("hypSuspect") as HTMLSelectElement).value = draft.suspectId || "";
  (document.getElementById("hypNature") as HTMLSelectElement).value = draft.nature || "";
  (document.getElementById("hypConfidence") as HTMLInputElement).value = draft.confidence || "50";
  document.getElementById("hypConfidenceValue")!.textContent = draft.confidence || "50";
  (document.getElementById("hypExplanation") as HTMLTextAreaElement).value =
    draft.explanation || "";
  (document.getElementById("hypAlternative") as HTMLTextAreaElement).value =
    draft.alternative || "";

  const evidenceSelect = document.getElementById("hypEvidence") as HTMLSelectElement;
  const savedIds = draft.evidenceIds || [];
  for (const option of evidenceSelect.options) {
    option.selected = savedIds.includes(option.value);
  }
}
