// Domain types matching the shape of public/data/*.json. 
import type { StatusValue, RelevanceValue } from "./constants.js";

export type PersonId = string; // e.g. "patch-vector"
export type EvidenceId = string; // e.g. "E01"
export type LocationId = string; // e.g. "L02"
export type TimelineId = string; // e.g. "T01"

export interface Person {
  id: PersonId;
  name: string;
  role: string;
  speciality: string;
  responsibilities: string[];
  statement: string;
  background: string;
  avatar: string;
}

export interface Location {
  id: LocationId;
  name: string;
  description: string;
  contains: string[];
}

export interface Evidence {
  id: EvidenceId;
  type: string;
  title: string;
  timestamp: string; 
  summary: string;
  content: string;
  personIds: PersonId[];
  locationIds: LocationId[];
  tags: string[];
  status: StatusValue;
  relevance: RelevanceValue;
  bookmarked?: boolean;
}

export type TimelineCertainty = "confirmed" | "reported" | "contradictory";

export interface TimelineEvent {
  id: TimelineId;
  time: string; 
  title: string;
  description: string;
  type: string;
  certainty: TimelineCertainty;
  personIds: PersonId[];
  locationIds: LocationId[];
  evidenceIds: EvidenceId[];
}

export interface CaseData {
  caseId: string;
  title: string;
  subtitle: string;
  status: string;
  opened: string; 
  summary: string;
  location: string;
  leadInvestigator: string;
  notes: string;
}
