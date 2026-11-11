import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import type { ViewName } from "../core/constants";
import { Header } from "./shared/components/Header";
import { Nav } from "./shared/components/Nav";
import { useCaseData } from "./features/dashboard/useCaseData";
import { DashboardPage } from "./features/dashboard/components/DashboardPage";
import { EvidencePage } from "./features/evidence/components/EvidencePage";
import { PeoplePage } from "./features/people-locations/components/PeoplePage";
import { PersonDetailPage } from "./features/people-locations/components/PersonDetailPage";
import { TimelinePage } from "./features/timeline/components/TimelinePage";
import { WorkspacePage } from "./features/workspace/components/WorkspacePage";

export function App() {
  const navigate = useNavigate();
  const data = useCaseData();
  const navigateToView = (view: ViewName): void => {
    void navigate(VIEW_PATHS[view]);
  };

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <Header />
          <Nav />
        </div>
      </header>

      <main id="app" className="app-main">
        <Routes>
          <Route
            path="/"
            element={<DashboardPage data={data} onNavigate={navigateToView} />}
          />
          <Route
            path="/dashboard"
            element={<DashboardPage data={data} onNavigate={navigateToView} />}
          />
          <Route path="/evidence" element={<EvidencePage />} />
          <Route path="/people" element={<PeoplePage data={data} />} />
          <Route
            path="/people/:personId"
            element={<PersonDetailPage data={data} />}
          />
          <Route path="/locations" element={<PeoplePage data={data} />} />
          <Route path="/timeline" element={<TimelinePage data={data} />} />
          <Route path="/workspace" element={<WorkspacePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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

const VIEW_PATHS: Record<ViewName, string> = {
  dashboard: "/",
  evidence: "/evidence",
  people: "/people",
  timeline: "/timeline",
  workspace: "/workspace",
};
