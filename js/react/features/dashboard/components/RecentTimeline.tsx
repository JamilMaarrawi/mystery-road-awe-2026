import { RECENT_ITEM_COUNT } from "../../../../core/constants";
import type { TimelineEvent } from "../../../../core/types";
import { formatDate } from "../../../../utils/format";

interface RecentTimelineProps {
  timeline: TimelineEvent[];
}

export function RecentTimeline({ timeline }: RecentTimelineProps) {
  const recent = timeline.slice(-RECENT_ITEM_COUNT).reverse();

  return (
    <div className="dashboard-panel">
      <h3>Recent timeline events</h3>
      {recent.length === 0 && <p>No timeline events loaded yet.</p>}
      {recent.map((evt) => (
        <div className="mini-list-item" key={evt.id}>
          <strong>{formatDate(evt.time)}</strong>
          <br />
          {evt.title}
        </div>
      ))}
    </div>
  );
}
