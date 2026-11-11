import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import type { ViewName } from "../core/constants";
import { readBookmarks, writeBookmarks } from "../services/storage";
import { toggleBookmark } from "./features/evidence/bookmarks";
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

  /*
   * Demo 5: before lifting, each view read bookmarks separately.
   *
   * EvidencePage:
   * const [bookmarks, setBookmarks] = useState(readBookmarks);
   * function handleBookmarkClick(id: string) {
   *   const updated = toggleBookmark(bookmarks, id);
   *   try {
   *     writeBookmarks(updated);
   *     setBookmarks(updated);
   *     setStorageError(null);
   *   } catch (error) {
   *     console.error("Could not save bookmark", error);
   *     setStorageError("Could not save the bookmark to local storage.");
   *   }
   * }
   *
   * DashboardPage: const bookmarkCount = readBookmarkCount();
   * WorkspacePage: const [bookmarks] = useState(readBookmarks);
   *
   *
   * The old Dashboard helper read and counted the saved IDs separately:
   * function readBookmarkCount(): number {
   *   const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
   *   if (raw === null) return 0;
   *   try {
   *     const parsed: unknown = JSON.parse(raw);
   *     return Array.isArray(parsed) ? parsed.length : 0;
   *   } catch (err) {
   *     console.warn('Ignoring unreadable localStorage entry "' + STORAGE_KEY_BOOKMARKS + '"', err);
   *     return 0;
   *   }
   * }
   *
   * Now App owns the state and passes it to all three views.
   */
  const [bookmarks, setBookmarks] = useState(readBookmarks);
  const [bookmarkError, setBookmarkError] = useState<string | null>(null);

  function handleBookmarkClick(id: string) {
    const updated = toggleBookmark(bookmarks, id);
    try {
      writeBookmarks(updated);
      setBookmarks(updated);
      setBookmarkError(null);
    } catch (error) {
      console.error("Could not save bookmark", error);
      setBookmarkError("Could not save the bookmark to local storage.");
    }
  }
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
            element={
              <DashboardPage data={data} bookmarks={bookmarks} onNavigate={navigateToView} />
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardPage data={data} bookmarks={bookmarks} onNavigate={navigateToView} />
            }
          />
          <Route
            path="/evidence"
            element={
              <EvidencePage
                data={data}
                bookmarks={bookmarks}
                onToggleBookmark={handleBookmarkClick}
                bookmarkError={bookmarkError}
              />
            }
          />
          <Route path="/people" element={<PeoplePage data={data} />} />
          <Route path="/people/:personId" element={<PersonDetailPage data={data} />} />
          <Route path="/locations" element={<PeoplePage data={data} />} />
          <Route path="/timeline" element={<TimelinePage data={data} />} />
          <Route path="/workspace" element={<WorkspacePage data={data} bookmarks={bookmarks} />} />
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
