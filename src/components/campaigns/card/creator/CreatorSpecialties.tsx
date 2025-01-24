import { Badge } from "@/components/ui/badge";

interface CreatorSpecialtiesProps {
  specialties?: string[];
}

export const CreatorSpecialties = ({ specialties }: CreatorSpecialtiesProps) => {
  if (!specialties?.length) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {specialties.map((specialty: string, index: number) => (
        <Badge
          key={index}
          variant="outline"
          className="bg-white/50"
        >
          {specialty}
        </Badge>
      ))}
    </div>
  );
};