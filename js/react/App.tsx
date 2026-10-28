import type { ViewName } from "../core/constants";
import { Header } from "./shared/components/Header";
import { Nav } from "./shared/components/Nav";
import { useCurrentView } from "./shared/useCurrentView";
import { useCaseData, type CaseDataState } from "./features/dashboard/useCaseData";
import { DashboardPage } from "./features/dashboard/components/DashboardPage";
import { EvidencePage } from "./features/evidence/components/EvidencePage";
import { PeoplePage } from "./features/people-locations/components/PeoplePage";
import { TimelinePage } from "./features/timeline/components/TimelinePage";
import { WorkspacePage } from "./features/workspace/components/WorkspacePage";

function renderPage(view: ViewName, data: CaseDataState, navigate: (view: ViewName) => void) {
  switch (view) {
    case "dashboard":
      return <DashboardPage data={data} onNavigate={navigate} />;
    case "evidence":
      return <EvidencePage />;
    case "people":
      return <PeoplePage data={data} />;
    case "timeline":
      return <TimelinePage data={data} />;
    case "workspace":
      return <WorkspacePage />;
  }
}

export function App() {
  const [currentView, navigate] = useCurrentView();
  const data = useCaseData();

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <Header />
          <Nav currentView={currentView} onNavigate={navigate} />
        </div>
      </header>

      <main id="app" className="app-main">
        {renderPage(currentView, data, navigate)}
      </main>

      <footer className="app-footer">
        <p>
          Project ReMotion Investigation Portal &mdash; Research Center AI, Software and IT-Security
          of HCW (fictional case study) &middot; <a href="index.html">Vanilla version</a>
        </p>
      </footer>
    </>
  );
}
