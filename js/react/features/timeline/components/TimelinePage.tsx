import { useSearchParams } from "react-router-dom";
import type { CaseDataState } from "../../dashboard/useCaseData";
import { TimelineEventCard } from "./TimelineEventCard";

interface TimelinePageProps {
  data: CaseDataState;
}

function getFilteredTimeline(
  timeline: CaseDataState["timeline"],
  personFilter: string | null,
  typeFilter: string | null
) {
  return timeline.filter((event) => {
    if (personFilter && !event.personIds.includes(personFilter)) {
      return false;
    }
    if (typeFilter && event.type !== typeFilter) {
      return false;
    }
    return true;
  });
}

export function TimelinePage({ data }: TimelinePageProps) {
  const [searchParams] = useSearchParams();
  const personFilter = searchParams.get("person");
  const typeFilter = searchParams.get("type");

  const filteredTimeline = getFilteredTimeline(data.timeline, personFilter, typeFilter);

  return (
    <section className="view active">
      <h2>Investigation Timeline</h2>
      <div className="timeline-container">
        {filteredTimeline.length > 0 ? (
          filteredTimeline.map((event) => (
            <TimelineEventCard key={event.id} event={event} locations={data.locations} />
          ))
        ) : (
          <p>No timeline events match the current filter.</p>
        )}
      </div>
    </section>
  );
}
