import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CREATOR_TYPES, CREATOR_SPECIALTIES } from "@/types/creator";

interface CreatorFiltersProps {
  selectedSpecialties: string[];
  selectedCreatorType: string | null;
  onSpecialtyChange: (specialty: string) => void;
  onCreatorTypeChange: (type: string | null) => void;
}

const CreatorFilters = ({ 
  selectedSpecialties, 
  selectedCreatorType,
  onSpecialtyChange,
  onCreatorTypeChange 
}: CreatorFiltersProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Creator Type</h3>
        <Select
          value={selectedCreatorType || "all"}
          onValueChange={(value) => onCreatorTypeChange(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {CREATOR_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Specialties</h3>
        <div className="flex flex-wrap gap-2">
          {CREATOR_SPECIALTIES.map((specialty) => (
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
    </div>
  );
};

export default CreatorFilters;