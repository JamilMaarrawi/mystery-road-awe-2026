import type { CaseDataState } from "../../dashboard/useCaseData";
import { TimelineEventCard } from "./TimelineEventCard";

interface TimelinePageProps {
  data: CaseDataState;
}

export function TimelinePage({ data }: TimelinePageProps) {
  return (
    <section className="view active">
      <h2>Investigation Timeline</h2>
      <div className="timeline-container">
        {data.timeline.map((event) => (
          <TimelineEventCard key={event.id} event={event} locations={data.locations} />
        ))}
      </div>
    </section>
  );
}
