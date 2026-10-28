import { useState, useEffect } from "react";
import type { CaseDataState } from "../../dashboard/useCaseData";
import { PersonCard } from "./PersonCard";
import { LocationCard } from "./LocationCard";
import { evidenceMentionsPerson } from "../../../../core/lookup";

interface PeoplePageProps {
  data: CaseDataState;
}

function readTabFromQuery(): "people" | "locations" {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get("tab");
  return tab === "locations" ? "locations" : "people";
}

function handleTabClick(tab: "people" | "locations"): void {
  const searchParams = new URLSearchParams(window.location.search);
  searchParams.set("tab", tab);
  window.history.replaceState(null, "", `?${searchParams.toString()}`);
  // Manually dispatch popstate to trigger the listener
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function PeoplePage({ data }: PeoplePageProps) {
  const [activeTab, setActiveTab] = useState<"people" | "locations">(readTabFromQuery);

  useEffect(() => {
    const handlePopState = () => {
      setActiveTab(readTabFromQuery());
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <section className="view active">
      <h2>People &amp; Locations</h2>

      <div className="tab-bar">
        <button
          type="button"
          className={`tab-btn ${activeTab === "people" ? "active" : ""}`}
          data-people-tab="people"
          onClick={() => handleTabClick("people")}
        >
          People
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === "locations" ? "active" : ""}`}
          data-people-tab="locations"
          onClick={() => handleTabClick("locations")}
        >
          Locations
        </button>
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
