// Values that more than one module has to agree on.

export const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
export const STORAGE_KEY_NOTES = "remotion_notes";
export const STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";

// Review status of an evidence item.
export const STATUS = {
  UNREVIEWED: "unreviewed",
  REVIEWED: "reviewed",
  FLAGGED: "flagged",
} as const;
export type StatusValue = (typeof STATUS)[keyof typeof STATUS];

// Investigator's relevance judgement on an evidence item.
export const RELEVANCE = {
  UNKNOWN: "unknown",
  RELEVANT: "relevant",
  IRRELEVANT: "irrelevant",
} as const;
export type RelevanceValue = (typeof RELEVANCE)[keyof typeof RELEVANCE];

// Routing
export const VIEWS = ["dashboard", "evidence", "people", "timeline", "workspace"] as const;
export type ViewName = (typeof VIEWS)[number];
export const DEFAULT_VIEW: ViewName = "dashboard";

export function isViewName(value: string): value is ViewName {
  return (VIEWS as readonly string[]).includes(value);
}

export const SORT_ORDERS = {
  TITLE_ASC: "title-asc",
  TITLE_DESC: "title-desc",
  DATE_ASC: "date-asc",
  DATE_DESC: "date-desc",
} as const;
export type SortOrder = (typeof SORT_ORDERS)[keyof typeof SORT_ORDERS];
export const DEFAULT_SORT_ORDER: SortOrder = SORT_ORDERS.DATE_DESC;

// How long the "Saved" confirmation stays on screen.
export const SAVED_MESSAGE_MS = 2000;
// How many items the dashboard's "Recent ..." panels show.
export const RECENT_ITEM_COUNT = 5;
