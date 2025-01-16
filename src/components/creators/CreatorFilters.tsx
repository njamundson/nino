import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreatorFiltersProps {
  selectedSpecialties: string[];
  onSpecialtyChange: (specialty: string) => void;
}

const CreatorFilters = ({ selectedSpecialties, onSpecialtyChange }: CreatorFiltersProps) => {
  const specialties = [
    "UGC",
    "Videography",
    "Photography",
    "Model/Talent",
    "Public Relations"
  ];

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">Filter by specialty</h3>
      <div className="flex flex-wrap gap-2">
        {specialties.map((specialty) => (
          <Badge
            key={specialty}
            variant="outline"
            className={cn(
              "px-4 py-2 text-base cursor-pointer transition-all duration-200",
              selectedSpecialties.includes(specialty)
                ? "bg-nino-primary text-white hover:bg-nino-primary/90"
                : "bg-nino-bg hover:border-nino-primary"
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