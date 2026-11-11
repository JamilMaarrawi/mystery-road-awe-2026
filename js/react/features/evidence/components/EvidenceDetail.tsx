import { useState } from "react";
import type { Evidence, Location, Person } from "../../../../core/types";
import { formatDate } from "../../../../utils/format";

interface EvidenceDetailProps {
  evidence: Evidence;
  people: Person[];
  locations: Location[];
  note: string;
  onSaveNote: (id: string, text: string) => boolean;
  onClose: () => void;
}

export function EvidenceDetail({
  evidence,
  people,
  locations,
  note,
  onSaveNote,
  onClose,
}: EvidenceDetailProps) {
  const [draft, setDraft] = useState(note);
  const [saved, setSaved] = useState(false);
  const personNames = evidence.personIds.map(
    (id) => people.find((person) => person.id === id)?.name ?? id
  );
  const locationNames = evidence.locationIds.map((id) => {
    const location = locations.find((item) => item.id === id);
    return location ? `${id} - ${location.name}` : id;
  });

  return (
    <section className="evidence-detail">
      <div className="evidence-detail-header">
        <div>
          <h2>{evidence.title}</h2>
          <div className="evidence-meta">
            {evidence.id} &middot; {evidence.type} &middot; {formatDate(evidence.timestamp)}
          </div>
        </div>
        <button type="button" className="btn btn-secondary btn-small" onClick={onClose}>
          Close
        </button>
      </div>
      {evidence.tags.includes("critical") && (
        <div className="warning-banner">This item is tagged as critical evidence.</div>
      )}
      <div className="detail-field">
        <strong>Summary</strong>
        {evidence.summary}
      </div>
      <div className="evidence-detail-content">{evidence.content}</div>
      <div className="detail-field">
        <strong>Related people</strong>
        {personNames.join(", ")}
      </div>
      <div className="detail-field">
        <strong>Related locations</strong>
        {locationNames.join(", ")}
      </div>
      <div className="detail-field">
        <strong>Tags</strong>
        {evidence.tags.map((tag) => (
          <span className="tag-chip" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <div className="detail-field">
        <strong>Review status</strong>
        {evidence.status}
      </div>
      <div className="detail-field">
        <strong>Relevance</strong>
        {evidence.relevance}
      </div>
      <div className="detail-field">
        <label htmlFor="evidenceNoteInput">
          <strong>Investigator note</strong>
        </label>
        <textarea
          id="evidenceNoteInput"
          className="note-textarea"
          rows={3}
          placeholder="Add a private note about this evidence..."
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setSaved(false);
          }}
        />
        <button
          type="button"
          className="btn btn-primary btn-small"
          onClick={() => setSaved(onSaveNote(evidence.id, draft))}
        >
          Save note
        </button>
        {saved && <span className="saved-msg"> Saved</span>}
      </div>
      <div className="detail-field">
        <strong>Note preview</strong>
        <div className="note-text">{note}</div>
      </div>
    </section>
  );
}
