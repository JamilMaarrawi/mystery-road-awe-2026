import { useEffect, useState } from "react";
import type { CaseData, Evidence, Location, Person, TimelineEvent } from "../../../core/types";

export type LoadStatus = "loading" | "ready" | "error";

export interface CaseDataState {
  caseData: CaseData | null;
  people: Person[];
  locations: Location[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  evidenceStatus: LoadStatus;
  timelineStatus: LoadStatus;
  // "core" = case, people and locations. Without them there is nothing to show.
  coreStatus: LoadStatus;
  coreError: string | null;
}

const INITIAL_STATE: CaseDataState = {
  caseData: null,
  people: [],
  locations: [],
  evidence: [],
  timeline: [],
  evidenceStatus: "loading",
  timelineStatus: "loading",
  coreStatus: "loading",
  coreError: null,
};

/**
 * Demo 5: Fetch from backend instead of static files
 * 
 * Backend URLs (running on localhost:3001, dev only):
 *   GET http://localhost:3001/api/case
 *   GET http://localhost:3001/api/people
 *   GET http://localhost:3001/api/locations
 *   GET http://localhost:3001/api/evidence
 *   GET http://localhost:3001/api/timeline
 */
const API_BASE = "http://localhost:3001/api";

// A type assertion, not a validation. The JSON is trusted to match T.
async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Could not load " + url + " (HTTP " + res.status + ")");
  }
  return (await res.json()) as T;
}

export function useCaseData(): CaseDataState {
  const [data, setData] = useState<CaseDataState>(INITIAL_STATE);

  useEffect(() => {
    // Set by the cleanup below, so a result that arrives after unmount is ignored.
    let cancelled = false;

    async function loadCore(): Promise<void> {
      try {
        // Demo 5: Fetch from backend instead of static files
        const caseData = await fetchJson<CaseData>(`${API_BASE}/case`);
        const people = await fetchJson<Person[]>(`${API_BASE}/people`);
        const locations = await fetchJson<Location[]>(`${API_BASE}/locations`);
        
        // Demo 4 comparison (static files approach — now replaced):
        // const caseData = await fetchJson<CaseData>("data/case.json");
        // const people = await fetchJson<Person[]>("data/people.json");
        // const locations = await fetchJson<Location[]>("data/locations.json");
        
        if (cancelled) return;
        setData((prev) => ({ ...prev, caseData, people, locations, coreStatus: "ready" }));
      } catch (err) {
        console.error("Failed to load the core case file", err);
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        setData((prev) => ({ ...prev, coreStatus: "error", coreError: message }));
      }
    }

    async function loadEvidence(): Promise<void> {
      try {
        // Demo 5: Fetch from backend
        const evidence = await fetchJson<Evidence[]>(`${API_BASE}/evidence`);
        
        // Demo 4 comparison (static files approach — now replaced):
        // const evidence = await fetchJson<Evidence[]>("data/evidence.json");
        
        if (!cancelled) setData((prev) => ({ ...prev, evidence, evidenceStatus: "ready" }));
      } catch (err) {
        console.error("Failed to load evidence from backend", err);
        if (!cancelled) setData((prev) => ({ ...prev, evidenceStatus: "error" }));
      }
    }

    async function loadTimeline(): Promise<void> {
      try {
        // Demo 5: Fetch from backend
        const timeline = await fetchJson<TimelineEvent[]>(`${API_BASE}/timeline`);
        
        // Demo 4 comparison (static files approach — now replaced):
        // const timeline = await fetchJson<TimelineEvent[]>("data/timeline.json");
        
        if (!cancelled) setData((prev) => ({ ...prev, timeline, timelineStatus: "ready" }));
      } catch (err) {
        console.error("Failed to load timeline from backend", err);
        if (!cancelled) setData((prev) => ({ ...prev, timelineStatus: "error" }));
      }
    }

    // Same as Demo 4: the three groups load independently.
    void loadCore();
    void loadEvidence();
    void loadTimeline();

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}

