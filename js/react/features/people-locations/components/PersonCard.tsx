import type { Person } from "../../../../core/types";
import { Link } from "react-router-dom";
import { Card } from "../../../shared/components/Card";

interface PersonCardProps {
  person: Person;
  evidenceCount: number | null;
  onEvidenceClick?: (personId: string) => void;
}

export function PersonCard({ person, evidenceCount, onEvidenceClick }: PersonCardProps) {
  return (
    <Card className="person-card">
      <div className="person-card-header">
        <img className="person-avatar" src={person.avatar} alt={`Portrait of ${person.name}`} />
        <div>
          <h3>
            <Link to={`/people/${person.id}`}>{person.name}</Link>
          </h3>
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
      {evidenceCount !== null && (
        <p>
          {evidenceCount} related evidence item{evidenceCount === 1 ? "" : "s"}
          {onEvidenceClick ? (
            <>
              {" "}
              &mdash;{" "}
              <button
                type="button"
                className="evidence-count-link"
                onClick={() => onEvidenceClick(person.id)}
              >
                view
              </button>
            </>
          ) : (
            " (evidence view not yet available)"
          )}
        </p>
      )}
    </Card>
  );
}
