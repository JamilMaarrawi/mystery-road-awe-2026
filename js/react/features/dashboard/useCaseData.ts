import { useEffect, useState } from "react";
import type { CaseData, Evidence, Location, Person, TimelineEvent } from "../../../core/types";

export type LoadStatus = "loading" | "ready" | "error";

export interface CaseDataState {
  caseData: CaseData | null;
  people: Person[];
  locations: Location[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
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
  coreStatus: "loading",
  coreError: null,
};

// A type assertion, not a validation. The JSON is trusted to match T.
async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error("Could not load " + path + " (HTTP " + res.status + ")");
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
        const caseData = await fetchJson<CaseData>("data/case.json");
        const people = await fetchJson<Person[]>("data/people.json");
        const locations = await fetchJson<Location[]>("data/locations.json");
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
        const evidence = await fetchJson<Evidence[]>("data/evidence.json");
        if (!cancelled) setData((prev) => ({ ...prev, evidence }));
      } catch (err) {
        console.error("Failed to load evidence.json", err);
      }
    }

    async function loadTimeline(): Promise<void> {
      try {
        const timeline = await fetchJson<TimelineEvent[]>("data/timeline.json");
        if (!cancelled) setData((prev) => ({ ...prev, timeline }));
      } catch (err) {
        console.error("Failed to load timeline.json", err);
      }
    }

    // Same as the vanilla loader: the three groups load independently.
    void loadCore();
    void loadEvidence();
    void loadTimeline();

    return () => {
      cancelled = true;
    };
  }, []);

  return data;
}
