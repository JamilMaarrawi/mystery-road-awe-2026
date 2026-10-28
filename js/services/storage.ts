// The only module that talks to localStorage.
import {
  STORAGE_KEY_BOOKMARKS,
  STORAGE_KEY_NOTES,
  STORAGE_KEY_HYPOTHESIS,
} from "../core/constants.js";
import { state } from "../core/state.js";
import type { EvidenceId } from "../core/types.js";

export interface HypothesisDraft {
  suspectId: string;
  nature: string;
  evidenceIds: EvidenceId[];
  confidence: string;
  explanation: string;
  alternative: string;
  savedAt: string;
}

// Stored data is untrusted, so parse defensively and fall back on bad input.
function readJson<T>(key: string, fallback: T, isValid: (value: unknown) => boolean): T {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    console.warn('Ignoring unreadable localStorage entry "' + key + '"', err);
    return fallback;
  }

  if (!isValid(parsed)) {
    console.warn('Ignoring localStorage entry "' + key + '": unexpected shape', parsed);
    return fallback;
  }
  // Only the general shape was checked, not that it matches T field for field.
  return parsed as T;
}

const isPlainObject = (value: unknown): boolean =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export function saveBookmarksToStorage(): void {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(state.bookmarks));
}

export function loadBookmarksFromStorage(): void {
  state.bookmarks = readJson<EvidenceId[]>(STORAGE_KEY_BOOKMARKS, [], Array.isArray);
}

export function saveNoteForEvidence(evidenceId: EvidenceId, text: string): void {
  state.notesStore[evidenceId] = text;
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(state.notesStore));
}

export function loadNoteForEvidence(evidenceId: EvidenceId): string {
  return state.notesStore[evidenceId] ?? "";
}

export function loadNotesFromStorage(): void {
  state.notesStore = readJson<Record<EvidenceId, string>>(STORAGE_KEY_NOTES, {}, isPlainObject);
}

// Returns null when nothing usable is stored.
export function readHypothesisDraft(): HypothesisDraft | null {
  return readJson<HypothesisDraft | null>(STORAGE_KEY_HYPOTHESIS, null, isPlainObject);
}

export function saveHypothesisDraft(draft: HypothesisDraft): void {
  localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
}
