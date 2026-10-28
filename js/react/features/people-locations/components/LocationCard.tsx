import type { Location } from "../../../../core/types";
import { Card } from "../../../shared/components/Card";

interface LocationCardProps {
  location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <Card className="location-card">
      <h3>
        {location.id} &mdash; {location.name}
      </h3>
      <p>{location.description}</p>
      <p>
        <strong>Contains:</strong>
      </p>
      <ul>
        {location.contains.map((item: string) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Card>
  );
}
