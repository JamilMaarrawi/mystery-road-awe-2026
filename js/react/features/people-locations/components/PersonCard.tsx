import type { Person } from "../../../../core/types";
import { Card } from "../../../shared/components/Card";
import { countEvidenceForPerson } from "../../../../core/lookup";

interface PersonCardProps {
  person: Person;
  onEvidenceClick?: (personId: string) => void;
}

export function PersonCard({ person, onEvidenceClick }: PersonCardProps) {
  const evidenceCount = countEvidenceForPerson(person);

  return (
    <Card className="person-card">
      <div className="person-card-header">
        <img
          className="person-avatar"
          src={person.avatar}
          alt={`Portrait of ${person.name}`}
        />
        <div>
          <h3>{person.name}</h3>
          <div className="person-role">{person.role}</div>
        </div>
      </div>
      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>
      <ul>
        {person.responsibilities.map((responsibility: string) => (
          <li key={responsibility}>{responsibility}</li>
        ))}
      </ul>
      <div className="person-statement">&ldquo;{person.statement}&rdquo;</div>
      <p>
        {evidenceCount} related evidence item{evidenceCount === 1 ? "" : "s"} &mdash;{" "}
        <button
          type="button"
          className="evidence-count-link"
          onClick={() => onEvidenceClick?.(person.id)}
        >
          view
        </button>
      </p>
    </Card>
  );
}
