// Small, pure formatting helpers.
import { isValid } from "date-fns";
import { STATUS, RELEVANCE } from "../core/constants.js";

export function formatDate(ts: string | number | null | undefined): string {
  if (!ts) return "Unknown date";
  const d = new Date(ts);
  if (!isValid(d)) return String(ts);
  return (
    d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

export function getStatusBadgeClass(status: string | null | undefined): string {
  const s = (status ?? "").toLowerCase();
  if (s === STATUS.REVIEWED) return "badge-reviewed";
  if (s === STATUS.FLAGGED) return "badge-flagged";
  return "badge-unreviewed";
}

export function getRelevanceBadgeClass(relevance: string | null | undefined): string {
  const r = (relevance ?? "").toLowerCase();
  if (r === RELEVANCE.RELEVANT) return "badge-relevant";
  return "badge-unreviewed";
}

export function certaintyBadgeClass(certainty: string | null | undefined): string {
  if (certainty === "confirmed") return "reviewed";
  if (certainty === "contradictory") return "critical";
  if (certainty === "reported") return "flagged";
  return "unreviewed";
}
