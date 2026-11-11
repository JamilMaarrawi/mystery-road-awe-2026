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
        <NavLink to="/people" className={`tab-btn ${activeTab === "people" ? "active" : ""}`}>
          People
        </NavLink>
        <NavLink to="/locations" className={`tab-btn ${activeTab === "locations" ? "active" : ""}`}>
          Locations
        </NavLink>
      </div>

      {data.coreStatus === "loading" && <p>Loading people and locations...</p>}
      {data.coreStatus === "error" && <p>Could not load people and locations: {data.coreError}</p>}
      {data.coreStatus === "ready" &&
        activeTab === "people" &&
        (data.people.length > 0 ? (
          <>
            {data.evidenceStatus === "loading" && <p>Loading evidence counts...</p>}
            {data.evidenceStatus === "error" && <p>Evidence counts could not be loaded.</p>}
            <div id="peoplePanel" className="people-grid">
              {data.people.map((person: (typeof data.people)[number]) => (
                <PersonCard
                  key={person.id}
                  person={person}
                  evidenceCount={
                    data.evidenceStatus === "ready"
                      ? data.evidence.filter((item) => evidenceMentionsPerson(item, person)).length
                      : null
                  }
                />
              ))}
            </div>
          </>
        ) : (
          <p id="peoplePanel">No people available.</p>
        ))}

      {data.coreStatus === "ready" &&
        activeTab === "locations" &&
        (data.locations.length > 0 ? (
          <div id="locationsPanel" className="locations-grid">
            {data.locations.map((location: (typeof data.locations)[number]) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        ) : (
          <p id="locationsPanel">No locations available.</p>
        ))}
    </section>
  );
}
