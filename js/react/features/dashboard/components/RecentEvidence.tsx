import { RECENT_ITEM_COUNT } from "../../../../core/constants";
import type { Evidence } from "../../../../core/types";
import { getStatusBadgeClass } from "../../../../utils/format";

interface RecentEvidenceProps {
  evidence: Evidence[];
}

export function RecentEvidence({ evidence }: RecentEvidenceProps) {
  // slice() copies, so reverse() does not change the original array.
  const recent = evidence.slice(-RECENT_ITEM_COUNT).reverse();

  return (
    <div className="dashboard-panel">
      <h3>Recent evidence</h3>
      {recent.length === 0 && <p>No evidence loaded yet.</p>}
      {recent.map((ev) => (
        <div className="mini-list-item" key={ev.id}>
          <strong>{ev.id}</strong> &mdash; {ev.title}{" "}
          <span className={"badge " + getStatusBadgeClass(ev.status)}>{ev.status}</span>
        </div>
      ))}
    </div>
  );
}
