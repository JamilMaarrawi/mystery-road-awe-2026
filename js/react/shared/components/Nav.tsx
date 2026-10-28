import { VIEWS, type ViewName } from "../../../core/constants";

const NAV_LABELS: Record<ViewName, string> = {
  dashboard: "Dashboard",
  evidence: "Evidence",
  people: "People & Locations",
  timeline: "Timeline",
  workspace: "Workspace",
};

interface NavProps {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
}

export function Nav({ currentView, onNavigate }: NavProps) {
  return (
    <nav className="main-nav" aria-label="Main navigation">
      {VIEWS.map((view) => (
        <button
          key={view}
          type="button"
          className={view === currentView ? "nav-btn active" : "nav-btn"}
          onClick={() => onNavigate(view)}
        >
          {NAV_LABELS[view]}
        </button>
      ))}
    </nav>
  );
}
