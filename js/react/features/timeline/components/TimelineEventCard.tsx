import type { Location, TimelineEvent } from "../../../../core/types";
import { certaintyBadgeClass, formatDate } from "../../../../utils/format";

interface TimelineEventCardProps {
  event: TimelineEvent;
  locations: Location[];
}

export function TimelineEventCard({ event, locations }: TimelineEventCardProps) {
  const eventLocationNames = event.locationIds.map((locationId) => {
    const location = locations.find((item) => item.id === locationId);
    return location ? `${location.id} - ${location.name}` : locationId;
  });

  return (
    <article className={`timeline-event certainty-${event.certainty}`}>
      <div className="timeline-time">
        {formatDate(event.time)}&nbsp;&middot;&nbsp;
        <span className={`badge badge-${certaintyBadgeClass(event.certainty)}`}>
          {event.certainty}
        </span>
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      {eventLocationNames.length > 0 && (
        <p className="evidence-meta">Location: {eventLocationNames.join(", ")}</p>
      )}
      {event.evidenceIds.length > 0 && (
        <p className="evidence-meta">Evidence: {event.evidenceIds.join(", ")}</p>
      )}
    </article>
  );
}
