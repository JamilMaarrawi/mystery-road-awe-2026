import type { EvidenceId } from "../../../core/types";

export function toggleBookmark(bookmarks: readonly EvidenceId[], id: EvidenceId): EvidenceId[] {
  return bookmarks.includes(id)
    ? bookmarks.filter((bookmark) => bookmark !== id)
    : [...bookmarks, id];
}
