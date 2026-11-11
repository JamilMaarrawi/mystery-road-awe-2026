import type { Evidence } from "../../../../core/types";
import { formatDate, getRelevanceBadgeClass, getStatusBadgeClass } from "../../../../utils/format";

interface EvidenceCardProps {
  evidence: Evidence;
  bookmarked: boolean;
  onBookmark: () => void;
  onOpen: () => void;
}

export function EvidenceCard({ evidence, bookmarked, onBookmark, onOpen }: EvidenceCardProps) {
  return (
    <article className="evidence-card">
      <button
        type="button"
        className={`bookmark-btn ${bookmarked ? "active" : ""}`}
        aria-label={`Toggle bookmark for ${evidence.title}`}
        aria-pressed={bookmarked}
        onClick={onBookmark}
      >
        {bookmarked ? "★" : "☆"}
      </button>
      <h3>{evidence.title}</h3>
      <div className="evidence-meta">
        {evidence.id} &middot; {evidence.type} &middot; {formatDate(evidence.timestamp)}
      </div>
      <div className="evidence-summary">{evidence.summary}</div>
      {evidence.tags.includes("critical") && <span className="badge badge-critical">Critical</span>}
      <span className={`badge ${getStatusBadgeClass(evidence.status)}`}>{evidence.status}</span>
      <span className={`badge ${getRelevanceBadgeClass(evidence.relevance)}`}>
        {evidence.relevance}
      </span>
      <div>
        {evidence.tags.map((tag) => (
          <span className="tag-chip" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <button type="button" className="btn btn-small btn-secondary" onClick={onOpen}>
        View details
      </button>
    </article>
  );
}
