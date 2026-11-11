import { NavLink, useLocation } from "react-router-dom";
import type { CaseDataState } from "../../dashboard/useCaseData";
import { PersonCard } from "./PersonCard";
import { LocationCard } from "./LocationCard";
import { evidenceMentionsPerson } from "../../../../core/lookup";

interface PeoplePageProps {
  data: CaseDataState;
}

export function PeoplePage({ data }: PeoplePageProps) {
  const { pathname } = useLocation();
  const activeTab = pathname === "/locations" ? "locations" : "people";

  return (
    <section className="view active">
      <h2>People &amp; Locations</h2>

      <div className="tab-bar">
        <NavLink
          to="/people"
          className={`tab-btn ${activeTab === "people" ? "active" : ""}`}
        >
          People
        </NavLink>
        <NavLink
          to="/locations"
          className={`tab-btn ${activeTab === "locations" ? "active" : ""}`}
        >
          Locations
        </NavLink>
      </div>

      {activeTab === "people" && (
        data.people.length > 0 ? (
          <div id="peoplePanel" className="people-grid">
            {data.people.map((person: typeof data.people[number]) => (
              <PersonCard
                key={person.id}
                person={person}
                evidenceCount={
                  data.evidence.filter((item) => evidenceMentionsPerson(item, person)).length
                }
              />
            ))}
          </div>
        ) : (
          <p id="peoplePanel">No people available.</p>
        )
      )}

      {activeTab === "locations" && (
        data.locations.length > 0 ? (
          <div id="locationsPanel" className="locations-grid">
            {data.locations.map((location: typeof data.locations[number]) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        ) : (
          <p id="locationsPanel">No locations available.</p>
        )
      )}
    </section>
  );
}
