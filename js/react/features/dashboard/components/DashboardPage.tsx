import type { ViewName } from "../../../../core/constants";
import type { CaseDataState } from "../useCaseData";
import { computeReviewStats } from "../dashboardStats";
import { readBookmarkCount } from "../bookmarks";
import { IntroCard } from "./IntroCard";
import { CaseSummaryCard } from "./CaseSummaryCard";
import { StatCard } from "./StatCard";
import { ReviewProgress } from "./ReviewProgress";
import { RecentEvidence } from "./RecentEvidence";
import { RecentTimeline } from "./RecentTimeline";

interface DashboardPageProps {
  data: CaseDataState;
  onNavigate: (view: ViewName) => void;
}

export function DashboardPage({ data, onNavigate }: DashboardPageProps) {
  // Derived values are recalculated on every render, so they cannot go stale.
  const { reviewedCount, progressPct } = computeReviewStats(data.evidence);
  const bookmarkCount = readBookmarkCount();

  return (
    <section className="view active">
      <h2>Case Dashboard</h2>

      <IntroCard onNavigate={onNavigate} />

      {data.coreStatus === "loading" && <p>Loading case file…</p>}
      {data.coreStatus === "error" && (
        <p>{(data.coreError ?? "Unknown error") + " - the case file could not be opened."}</p>
      )}

      {data.coreStatus === "ready" && (
        <>
          <CaseSummaryCard caseData={data.caseData} />

          <div className="stat-grid">
            <StatCard value={data.evidence.length} label="Evidence items" />
            <StatCard value={data.people.length} label="People" />
            <StatCard value={data.locations.length} label="Locations" />
            <StatCard value={bookmarkCount} label="Bookmarked" />
            <StatCard value={reviewedCount} label="Reviewed" />
          </div>

          <ReviewProgress percent={progressPct} />

          <div className="dashboard-columns">
            <RecentEvidence evidence={data.evidence} />
            <RecentTimeline timeline={data.timeline} />
          </div>
        </>
      )}
    </section>
  );
}
