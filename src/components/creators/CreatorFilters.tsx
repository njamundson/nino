import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CreatorFiltersProps {
  selectedSpecialties: string[];
  selectedCreatorTypes: string[];
  onSpecialtyChange: (specialty: string) => void;
  onCreatorTypeChange: (type: string) => void;
}

const CreatorFilters = ({ 
  selectedSpecialties, 
  selectedCreatorTypes,
  onSpecialtyChange,
  onCreatorTypeChange 
}: CreatorFiltersProps) => {
  const specialties = [
    "UGC Creator",
    "Videographer",
    "Photographer",
    "Model/Talent",
    "Public Relations/Writer"
  ];

  const creatorTypes = ["Solo", "Couple", "Family", "Group"];

  return (
    <div className="mb-8 space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-700">Specialties</h3>
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

      <div>
        <h3 className="text-sm font-medium mb-3 text-gray-700">Creator Type</h3>
        <div className="flex flex-wrap gap-2">
          {creatorTypes.map((type) => (
            <Badge
              key={type}
              variant="outline"
              className={cn(
                "px-4 py-2 text-base cursor-pointer transition-all duration-200 border-2",
                selectedCreatorTypes.includes(type.toLowerCase())
                  ? "bg-nino-primary text-white hover:bg-nino-primary/90 border-nino-primary"
                  : "bg-transparent text-nino-primary hover:bg-nino-primary/10 border-nino-primary"
              )}
              onClick={() => onCreatorTypeChange(type.toLowerCase())}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreatorFilters;