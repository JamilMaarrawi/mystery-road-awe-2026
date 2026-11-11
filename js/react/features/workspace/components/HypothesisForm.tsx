import { useState } from "react";
import type { FormEvent } from "react";
import type { Evidence, Person } from "../../../../core/types";
import {
  readHypothesisDraft,
  saveHypothesisDraft,
  type HypothesisDraft,
} from "../../../../services/storage";

type HypothesisFields = Omit<HypothesisDraft, "savedAt">;

interface HypothesisFormProps {
  people: Person[];
  evidence: Evidence[];
}

function initialFields(): HypothesisFields {
  const saved = readHypothesisDraft();
  return {
    suspectId: saved?.suspectId ?? "",
    nature: saved?.nature ?? "",
    evidenceIds: saved?.evidenceIds ?? [],
    confidence: saved?.confidence ?? "50",
    explanation: saved?.explanation ?? "",
    alternative: saved?.alternative ?? "",
  };
}

export function HypothesisForm({ people, evidence }: HypothesisFormProps) {
  const [fields, setFields] = useState(initialFields);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const missingSuspect =
    fields.suspectId && !people.some((person) => person.id === fields.suspectId);
  const missingEvidence = fields.evidenceIds.filter(
    (id) => !evidence.some((item) => item.id === id)
  );
  const missingNature =
    fields.nature && !["accidental", "deliberate", "unclear"].includes(fields.nature);

  function updateFields(changes: Partial<HypothesisFields>) {
    setFields((current) => ({ ...current, ...changes }));
    setSaveStatus("idle");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      saveHypothesisDraft({ ...fields, savedAt: new Date().toISOString() });
      setSaveStatus("saved");
    } catch (error) {
      console.error("Could not save hypothesis draft", error);
      setSaveStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="hypSuspect">Suspected responsible person</label>
        <select
          id="hypSuspect"
          value={fields.suspectId}
          onChange={(event) => updateFields({ suspectId: event.target.value })}
        >
          <option value="">Select a person…</option>
          {missingSuspect && (
            <option value={fields.suspectId}>{fields.suspectId} (unavailable)</option>
          )}
          {people.map((person) => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <label htmlFor="hypNature">Accidental or deliberate incident</label>
        <select
          id="hypNature"
          value={fields.nature}
          onChange={(event) => updateFields({ nature: event.target.value })}
        >
          <option value="">Select…</option>
          {missingNature && <option value={fields.nature}>{fields.nature} (unavailable)</option>}
          <option value="accidental">Accidental</option>
          <option value="deliberate">Deliberate</option>
          <option value="unclear">Unclear</option>
        </select>
      </div>
      <div className="form-row">
        <label htmlFor="hypEvidence">Selected supporting evidence</label>
        <select
          id="hypEvidence"
          multiple
          size={6}
          value={fields.evidenceIds}
          onChange={(event) =>
            updateFields({
              evidenceIds: Array.from(event.target.selectedOptions, (option) => option.value),
            })
          }
        >
          {missingEvidence.map((id) => (
            <option key={id} value={id}>
              {id} (unavailable)
            </option>
          ))}
          {evidence.map((item) => (
            <option key={item.id} value={item.id}>
              {item.id} - {item.title}
            </option>
          ))}
        </select>
      </div>
      <div className="form-row">
        <label htmlFor="hypConfidence">Confidence (0–100)</label>
        <input
          type="range"
          id="hypConfidence"
          min="0"
          max="100"
          value={fields.confidence}
          onChange={(event) => updateFields({ confidence: event.target.value })}
        />
        <output htmlFor="hypConfidence">{fields.confidence}</output>
      </div>
      <div className="form-row">
        <label htmlFor="hypExplanation">Written explanation</label>
        <textarea
          id="hypExplanation"
          rows={4}
          value={fields.explanation}
          onChange={(event) => updateFields({ explanation: event.target.value })}
          placeholder="Explain your reasoning…"
        />
      </div>
      <div className="form-row">
        <label htmlFor="hypAlternative">Alternative explanation</label>
        <textarea
          id="hypAlternative"
          rows={3}
          value={fields.alternative}
          onChange={(event) => updateFields({ alternative: event.target.value })}
          placeholder="What else could explain the evidence?"
        />
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          Save hypothesis draft
        </button>
        {saveStatus === "saved" && (
          <span className="saved-msg" role="status">
            Saved
          </span>
        )}
        {saveStatus === "error" && (
          <span role="alert">Your hypothesis could not be saved to local storage.</span>
        )}
      </div>
    </form>
  );
}
