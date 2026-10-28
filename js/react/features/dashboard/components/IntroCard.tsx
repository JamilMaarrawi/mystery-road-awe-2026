import type { ViewName } from "../../../../core/constants";

interface IntroItem {
  view: ViewName;
  title: string;
  text: string;
  button: string;
}

const INTRO_ITEMS: IntroItem[] = [
  {
    view: "evidence",
    title: "1. Evidence Catalogue",
    text: "Search, filter, and sort every evidence item. Open one for full details, related people and locations, and to add a private note.",
    button: "Go to Evidence",
  },
  {
    view: "people",
    title: "2. People & Locations",
    text: "Read profiles and statements from the six team members involved, and look up the six key locations in the investigation.",
    button: "Go to People & Locations",
  },
  {
    view: "timeline",
    title: "3. Timeline",
    text: "Walk through events in chronological order, filter by person, location, or type, and jump straight to the evidence behind any event.",
    button: "Go to Timeline",
  },
  {
    view: "workspace",
    title: "4. Investigator Workspace",
    text: "Your bookmarked evidence and notes collect here. Draft a hypothesis — who you suspect, why, and how confident you are — it's saved automatically in your browser.",
    button: "Go to Workspace",
  },
];

interface IntroCardProps {
  onNavigate: (view: ViewName) => void;
}

export function IntroCard({ onNavigate }: IntroCardProps) {
  return (
    <div className="intro-card">
      <h3>How to use this portal</h3>
      <p>
        Everything gathered on the case so far is organised into four working views. Use the
        navigation bar at the top to move between them at any time.
      </p>
      <div className="howto-grid">
        {INTRO_ITEMS.map((item) => (
          <div className="howto-item" key={item.view}>
            <h4>{item.title}</h4>
            <p>{item.text}</p>
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => onNavigate(item.view)}
            >
              {item.button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
