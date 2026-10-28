// Lookups over the loaded case data.
import { state } from "./state.js";
import type { Evidence, EvidenceId, Person, PersonId, Location, LocationId } from "./types.js";

export function findEvidenceById(id: EvidenceId): Evidence | null {
  return state.allEvidence.find((e) => e.id === id) ?? null;
}

export function findPersonById(id: PersonId): Person | null {
  return state.allPeople.find((p) => p.id === id) ?? null;
}

export function findLocationById(id: LocationId): Location | null {
  return state.allLocations.find((l) => l.id === id) ?? null;
}

// "L01 - Name", or the raw id when the location is unknown.
export function locationLabel(id: LocationId): string {
  const loc = findLocationById(id);
  return loc ? loc.id + " - " + loc.name : id;
}

// Some evidence records store a person's id, but E04 stores their display name.
export function evidenceMentionsPerson(ev: Evidence, person: Person): boolean {
  if (!ev.personIds) return false;
  return ev.personIds.includes(person.id) || ev.personIds.includes(person.name);
}

export function countEvidenceForPerson(person: Person): number {
  return state.allEvidence.filter((e) => evidenceMentionsPerson(e, person)).length;
}
