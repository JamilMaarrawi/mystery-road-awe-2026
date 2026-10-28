import { STORAGE_KEY_BOOKMARKS } from "../../../core/constants";

// Reads the saved bookmark ids straight from localStorage. The stored value is
// untrusted, so anything that is not a valid JSON array counts as "no bookmarks".
export function readBookmarkCount(): number {
  const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
  if (raw === null) return 0;
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch (err) {
    console.warn('Ignoring unreadable localStorage entry "' + STORAGE_KEY_BOOKMARKS + '"', err);
    return 0;
  }
}
