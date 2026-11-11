import { Link, useParams } from "react-router-dom";
import type { CaseDataState } from "../../dashboard/useCaseData";
import { Card } from "../../../shared/components/Card";

interface PersonDetailPageProps {
  data: CaseDataState;
}

export function PersonDetailPage({ data }: PersonDetailPageProps) {
  const { personId } = useParams<{ personId: string }>();
  const person = data.people.find((item) => item.id === personId);

  if (data.coreStatus === "loading") {
    return (
      <section className="view active">
        <h2>Loading person...</h2>
      </section>
    );
  }

  if (data.coreStatus === "error") {
    return (
      <section className="view active">
        <h2>Could not load person</h2>
        <p>{data.coreError ?? "The case data could not be opened."}</p>
        <Link to="/people">Back to People</Link>
      </section>
    );
  }

  if (!person) {
    return (
      <section className="view active">
        <h2>Person not found</h2>
        <p>No person matches the id &ldquo;{personId}&rdquo;.</p>
        <Link to="/people">Back to People</Link>
      </section>
    );
  }

  return (
    <section className="view active">
      <p>
        <Link to="/people">Back to People</Link>
      </p>
      <Card className="person-card">
        <div className="person-card-header">
          <img className="person-avatar" src={person.avatar} alt={`Portrait of ${person.name}`} />
          <div>
            <h2>{person.name}</h2>
            <div className="person-role">{person.role}</div>
          </div>
        </div>
        <p>
          <strong>Speciality:</strong> {person.speciality}
        </p>
        <p>{person.background}</p>
        <ul>
          {person.responsibilities.map((responsibility) => (
            <li key={responsibility}>{responsibility}</li>
          ))}
        </ul>
        <div className="person-statement">&ldquo;{person.statement}&rdquo;</div>
      </Card>
    </section>
  );
}
