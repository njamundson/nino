import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreatorFiltersProps {
  selectedSpecialties: string[];
  onSpecialtyChange: (specialty: string) => void;
}

const CreatorFilters = ({ selectedSpecialties, onSpecialtyChange }: CreatorFiltersProps) => {
  // Updated to match the specialties in the database
  const specialties = [
    "UGC Creator",
    "Videographer",
    "Photographer",
    "Model/Talent",
    "Public Relations/Writer"
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2">
        {specialties.map((specialty) => (
          <Badge
            key={specialty}
            variant="outline"
            className={cn(
              "px-4 py-2 text-base cursor-pointer transition-all duration-200 border-2",
              selectedSpecialties.includes(specialty)
                ? "bg-nino-primary text-white hover:bg-nino-primary/90 border-nino-primary"
                : "bg-transparent text-nino-primary hover:bg-nino-primary/10 border-nino-primary"
            )}
            onClick={() => onSpecialtyChange(specialty)}
          >
            {specialty}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default CreatorFilters;