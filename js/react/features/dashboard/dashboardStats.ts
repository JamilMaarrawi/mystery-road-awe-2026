import { STATUS } from "../../../core/constants";
import type { Evidence } from "../../../core/types";

export interface ReviewStats {
  reviewedCount: number;
  progressPct: number;
}

// Pure function: same input, same output. It is called on every render,
// so the numbers can never be stale.
export function computeReviewStats(evidence: Evidence[]): ReviewStats {
  const reviewedCount = evidence.filter(
    (ev) => (ev.status || "").toLowerCase() === STATUS.REVIEWED
  ).length;

  const progressPct =
    evidence.length === 0 ? 0 : Math.round((reviewedCount / evidence.length) * 100);

  return { reviewedCount, progressPct };
}
