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

  const filteredTimeline = getFilteredTimeline(data.timeline, personFilter, typeFilter)
    .slice()
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  const eventTypes = [...new Set(data.timeline.map((event) => event.type))];
  const unknownPerson = personFilter && !data.people.some((person) => person.id === personFilter);
  const unknownType = typeFilter && !eventTypes.includes(typeFilter);

  return (
    <section className="view active">
      <h2>Investigation Timeline</h2>
      <div className="toolbar">
        <p>Filters are not interactive yet. Person and type filters can be set in the URL.</p>
        <div className="toolbar-row">
          <label htmlFor="timelineOrder" className="visually-hidden">
            Order
          </label>
          <select id="timelineOrder" value="asc" disabled>
            <option value="asc">Oldest first</option>
            <option value="desc">Newest first</option>
          </select>

          <label htmlFor="timelinePersonFilter" className="visually-hidden">
            Filter by person
          </label>
          <select id="timelinePersonFilter" value={personFilter ?? ""} disabled>
            <option value="">All people</option>
            {unknownPerson && <option value={personFilter}>{personFilter}</option>}
            {data.people.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>

          <label htmlFor="timelineLocationFilter" className="visually-hidden">
            Filter by location
          </label>
          <select id="timelineLocationFilter" value="" disabled>
            <option value="">All locations</option>
            {data.locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.id}
              </option>
            ))}
          </select>

          <label htmlFor="timelineTypeFilter" className="visually-hidden">
            Filter by event type
          </label>
          <select id="timelineTypeFilter" value={typeFilter ?? ""} disabled>
            <option value="">All event types</option>
            {unknownType && <option value={typeFilter}>{typeFilter}</option>}
            {eventTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
      {data.coreStatus === "error" && (
        <p>People and location details could not be loaded: {data.coreError}</p>
      )}
      <div className="timeline-container">
        {data.timelineStatus === "loading" && <p>Loading timeline...</p>}
        {data.timelineStatus === "error" && <p>Could not load timeline events.</p>}
        {data.timelineStatus === "ready" &&
          (filteredTimeline.length > 0 ? (
            filteredTimeline.map((event) => (
              <TimelineEventCard key={event.id} event={event} locations={data.locations} />
            ))
          ) : (
            <p>No timeline events match the current filter.</p>
          ))}
      </div>
    </section>
  );
}
