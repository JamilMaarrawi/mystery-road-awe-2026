import { useState } from "react";
import { Link } from "react-router-dom";
import type { CaseDataState } from "../../dashboard/useCaseData";
import { readNotes } from "../../../../services/storage";
import { HypothesisForm } from "./HypothesisForm";

interface WorkspacePageProps {
  data: CaseDataState;
  bookmarks: readonly string[];
}

export function WorkspacePage({ data, bookmarks }: WorkspacePageProps) {
  const [notes] = useState(readNotes);
  const bookmarkedItems = data.evidence.filter((item) => bookmarks.includes(item.id));
  const notedItems = data.evidence.filter((item) => notes[item.id]);

  return (
    <section className="view active">
      <h2>Investigator Workspace</h2>
      {data.evidenceStatus === "loading" && <p>Loading evidence...</p>}
      {data.evidenceStatus === "error" && <p>Could not load evidence for the workspace.</p>}
      <div className="workspace-grid">
        <div className="workspace-col">
          <h3>Bookmarked Evidence</h3>
          <div className="bookmarks-list">
            {data.evidenceStatus === "ready" &&
              (bookmarkedItems.length === 0 ? (
                <p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>
              ) : (
                bookmarkedItems.map((item) => (
                  <div className="mini-list-item" key={item.id}>
                    <strong>{item.id}</strong> &mdash; {item.title}{" "}
                    <Link
                      className="btn btn-small btn-secondary"
                      to={`/evidence?item=${encodeURIComponent(item.id)}`}
                    >
                      Open
                    </Link>
                  </div>
                ))
              ))}
          </div>
        </div>
        <div className="workspace-col">
          <h3>Personal Notes</h3>
          <p className="hint-text">Notes are attached to evidence items in the Evidence view.</p>
          <div className="notes-list">
            {data.evidenceStatus === "ready" &&
              (notedItems.length === 0 ? (
                <p>No notes yet. Add one from an evidence item's detail view.</p>
              ) : (
                notedItems.map((item) => (
                  <div className="mini-list-item" key={item.id}>
                    <strong>{item.id}</strong> &mdash; {item.title}
                    <div className="note-text">{notes[item.id]}</div>
                  </div>
                ))
              ))}
          </div>
        </div>
      </div>
      <div className="hypothesis-card">
        <h3>Hypothesis Draft</h3>
        {data.coreStatus === "error" && <p>Could not load people for the hypothesis form.</p>}
        {(data.coreStatus === "loading" || data.evidenceStatus === "loading") && (
          <p>Loading hypothesis options...</p>
        )}
        {data.coreStatus === "ready" && data.evidenceStatus === "ready" && (
          <HypothesisForm people={data.people} evidence={data.evidence} />
        )}
      </div>
    </section>
  );
}
